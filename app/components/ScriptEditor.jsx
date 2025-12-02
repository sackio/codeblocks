import React from 'react';
import Brick from 'components/engine/Brick';
import { RGBAToHexString } from 'utils';
import { examplesList } from 'utils/examples';

import styles from 'styles/components/script-editor';


class ScriptEditor extends React.Component {
  state = {
    error: null,
    running: false,
    cheatsheetOpen: false,
    syntaxWarning: null,
  }

  componentDidMount() {
    // Only auto-generate if no script exists (scriptText prop is empty)
    // This preserves loaded examples and user-written scripts
    if (!this.props.scriptText) {
      this._generateScriptFromBricks();
    }
  }

  componentDidUpdate(prevProps) {
    // Only regenerate if bricks changed AND user hasn't modified the script AND not running
    // This prevents regeneration when loading and running examples
    if (prevProps.bricks !== this.props.bricks && !this.props.scriptUserModified && !this.state.running) {
      this._generateScriptFromBricks();
    }
  }

  _colorToRGBA = (color) => {
    // Convert any CSS color (hex, named, rgb, etc.) to RGBA object

    // First try hex format
    const hexResult = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    if (hexResult) {
      return {
        r: parseInt(hexResult[1], 16),
        g: parseInt(hexResult[2], 16),
        b: parseInt(hexResult[3], 16),
        a: 1
      };
    }

    // For named colors or other CSS color formats, use browser's color parsing
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const imageData = ctx.getImageData(0, 0, 1, 1);
    const data = imageData.data;

    return {
      r: data[0],
      g: data[1],
      b: data[2],
      a: data[3] / 255
    };
  }

  _generateScriptFromBricks = () => {
    const { bricks, onScriptChange } = this.props;

    if (bricks.length === 0) {
      const exampleScript = `// Example: Create a colorful tower
for (let i = 0; i < 5; i++) {
  createBrick({
    color: ['red', 'blue', 'green', 'yellow', 'orange'][i],
    position: { x: 0, y: i * 33, z: 0 },
    dimensions: { x: 2, z: 2 }
  });
  await wait(300);
}`;
      onScriptChange(exampleScript, false);
      this.setState({ syntaxWarning: null });
      return;
    }

    // Generate script to recreate current scene
    let script = '// Script to recreate current scene\n';
    script += '// Clear existing scene first if needed\n';
    script += '// clearScene();\n\n';

    bricks.forEach((brick, index) => {
      const color = RGBAToHexString(brick._color);
      const pos = brick.position;
      const dims = brick._dimensions;
      const rotation = brick.rotation.y;

      script += `// Brick ${index + 1}\n`;
      script += `createBrick({\n`;
      script += `  type: '${dims.type || 'rectangle'}',\n`;
      script += `  color: '${color}',\n`;
      script += `  position: { x: ${Math.round(pos.x)}, y: ${Math.round(pos.y)}, z: ${Math.round(pos.z)} },\n`;
      if (rotation !== 0) {
        script += `  rotation: ${rotation.toFixed(4)},\n`;
      }
      script += `  dimensions: { x: ${dims.x}, z: ${dims.z} }\n`;
      script += `});\n`;

      // Add a small delay between bricks for visual effect
      if (index < bricks.length - 1) {
        script += `await wait(50);\n`;
      }
      script += `\n`;
    });

    onScriptChange(script, false);
    this.setState({ syntaxWarning: null });
  }

  _validateJavaScriptSyntax = (code) => {
    try {
      // Try to parse as a function to check syntax
      new Function(
        'createBrick',
        'moveBrick',
        'deleteBrick',
        'setBrickColor',
        'clearScene',
        'getBricks',
        'brick',
        'getBrickId',
        'wait',
        'createGrid',
        'setTopView',
        'setFrontView',
        'setSideView',
        'setIsometricView',
        'resetView',
        'zoomIn',
        'zoomOut',
        'setCameraPosition',
        'setCameraTarget',
        'setCameraView',
        'getCameraPosition',
        'getCameraTarget',
        `return (async () => {\n${code}\n})();`
      );
      return null; // No error
    } catch (err) {
      // Extract useful error information
      let message = err.message;

      // Try to extract line number if available
      const lineMatch = message.match(/line (\d+)/i);
      if (lineMatch) {
        return `Syntax error at line ${lineMatch[1]}: ${message}`;
      }

      return `Syntax error: ${message}`;
    }
  }

  _handleScriptChange = (e) => {
    const newText = e.target.value;

    // Validate JavaScript syntax in real-time
    const syntaxWarning = newText.trim() ? this._validateJavaScriptSyntax(newText) : null;

    this.props.onScriptChange(newText, true);
    this.setState({
      error: null,
      syntaxWarning,
    });
  }

  _createScriptingAPI = () => {
    const {
      addObject,
      removeObject,
      updateObject,
      resetScene,
      bricks,
      setTopView,
      setFrontView,
      setSideView,
      setIsometricView,
      resetView,
      zoomIn,
      zoomOut,
      setCameraPosition,
      setCameraTarget,
      setCameraView,
      getCameraPosition,
      getCameraTarget,
    } = this.props;

    // Object-oriented chainable Brick wrapper
    class BrickAPI {
      constructor(brickId, apiMethods) {
        this.id = brickId;
        this._api = apiMethods;
        this._chain = Promise.resolve();
      }

      // Chainable methods - they add to the promise chain and return this
      color(newColor) {
        this._chain = this._chain.then(() => {
          this._api.setBrickColor(this.id, newColor);
        });
        return this;
      }

      move(position) {
        this._chain = this._chain.then(() => {
          this._api.moveBrick(this.id, position);
        });
        return this;
      }

      moveBy(delta) {
        this._chain = this._chain.then(() => {
          const brick = bricks.find(b => b.customId === this.id);
          if (brick) {
            const newPos = {
              x: brick.position.x + (delta.x || 0),
              y: brick.position.y + (delta.y || 0),
              z: brick.position.z + (delta.z || 0)
            };
            this._api.moveBrick(this.id, newPos);
          }
        });
        return this;
      }

      rotate(angle) {
        this._chain = this._chain.then(() => {
          const brick = bricks.find(b => b.customId === this.id);
          if (brick) {
            brick.rotation.y = angle;
            updateObject(brick);
          }
        });
        return this;
      }

      wait(ms) {
        this._chain = this._chain.then(() => this._api.wait(ms));
        return this;
      }

      delete() {
        this._chain = this._chain.then(() => {
          this._api.deleteBrick(this.id);
        });
        return this._chain; // Return the promise for final await
      }

      // Get properties (not chainable - execute immediately)
      getPosition() {
        const brick = bricks.find(b => b.customId === this.id);
        return brick ? { x: brick.position.x, y: brick.position.y, z: brick.position.z } : null;
      }

      getColor() {
        const brick = bricks.find(b => b.customId === this.id);
        return brick ? brick._color : null;
      }

      // Make the object awaitable - this executes the chain
      then(resolve, reject) {
        return this._chain.then(() => this).then(resolve, reject);
      }
    }

    const api = {
      // Create a brick with specified options
      // Returns BrickAPI object for chaining
      createBrick: (options = {}) => {
        const {
          type = 'rectangle',
          color = '#ff6b35',
          position = { x: 0, y: 12, z: 0 },
          rotation = 0,
          dimensions = { x: 2, z: 2 }
        } = options;

        // Merge type into dimensions to ensure it's always set
        const finalDimensions = { ...dimensions, type };

        // Convert color to RGBA format (supports hex, named colors, etc.)
        const rgbaColor = this._colorToRGBA(color);

        // Create fake intersect for Brick constructor
        const fakeIntersect = {
          point: new THREE.Vector3(position.x, position.y, position.z),
          face: { normal: new THREE.Vector3(0, 1, 0) }
        };

        const brick = new Brick(fakeIntersect, rgbaColor, finalDimensions, rotation, 0);
        brick.position.set(position.x, position.y, position.z);

        addObject(brick);

        // Return BrickAPI object for OOP style
        return new BrickAPI(brick.customId, api);
      },

      // Move a brick to a new position
      moveBrick: (id, position) => {
        const brick = bricks.find(b => b.customId === id);
        if (brick) {
          brick.position.set(position.x, position.y, position.z);
          updateObject(brick);
        }
      },

      // Delete a brick by ID
      deleteBrick: (id) => {
        removeObject(id);
      },

      // Set brick color
      setBrickColor: (id, color) => {
        const brick = bricks.find(b => b.customId === id);
        if (brick) {
          const rgbaColor = this._colorToRGBA(color);
          brick.updateColor(rgbaColor);
          updateObject(brick);
        }
      },

      // Clear all bricks from scene
      clearScene: () => {
        resetScene();
      },

      // Get all bricks (functional style)
      getBricks: () => {
        return bricks.map(b => ({
          id: b.customId,
          position: { x: b.position.x, y: b.position.y, z: b.position.z },
          color: b._color,
          dimensions: b._dimensions,
        }));
      },

      // Get a brick by ID and wrap it for OOP chaining
      brick: (brickId) => {
        const brick = bricks.find(b => b.customId === brickId);
        if (!brick) return null;
        return new BrickAPI(brickId, api);
      },

      // Alias for backwards compatibility (returns just ID)
      getBrickId: (index) => {
        return bricks[index]?.customId;
      },

      // Wait/delay for animations
      wait: (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
      },

      // Create a grid of bricks
      createGrid: async (width, depth, options = {}) => {
        const ids = [];
        const {
          color = '#ff6b35',
          type = 'rectangle',
          spacing = 25,
          animate = true,
          delay = 100,
        } = options;

        for (let x = 0; x < width; x++) {
          for (let z = 0; z < depth; z++) {
            const id = api.createBrick({
              color,
              type,
              position: { x: x * spacing, y: 12, z: z * spacing },
              dimensions: { x: 2, z: 2, type }
            });
            ids.push(id);
            if (animate) {
              await api.wait(delay);
            }
          }
        }
        return ids;
      },

      // Camera control methods
      setTopView: () => {
        if (setTopView) setTopView();
        return api.wait(0); // Return a promise for consistency
      },

      setFrontView: () => {
        if (setFrontView) setFrontView();
        return api.wait(0);
      },

      setSideView: () => {
        if (setSideView) setSideView();
        return api.wait(0);
      },

      setIsometricView: () => {
        if (setIsometricView) setIsometricView();
        return api.wait(0);
      },

      resetView: () => {
        if (resetView) resetView();
        return api.wait(0);
      },

      zoomIn: () => {
        if (zoomIn) zoomIn();
        return api.wait(0);
      },

      zoomOut: () => {
        if (zoomOut) zoomOut();
        return api.wait(0);
      },

      // Custom camera position and target methods
      setCameraPosition: (x, y, z) => {
        if (setCameraPosition) setCameraPosition(x, y, z);
        return api.wait(0);
      },

      setCameraTarget: (x, y, z) => {
        if (setCameraTarget) setCameraTarget(x, y, z);
        return api.wait(0);
      },

      setCameraView: (position, target) => {
        if (setCameraView) setCameraView(position, target);
        return api.wait(0);
      },

      getCameraPosition: () => {
        if (getCameraPosition) return getCameraPosition();
        return { x: 0, y: 0, z: 0 };
      },

      getCameraTarget: () => {
        if (getCameraTarget) return getCameraTarget();
        return { x: 0, y: 0, z: 0 };
      },
    };

    return api;
  }

  _handleRun = async () => {
    const { scriptText, resetScene } = this.props;

    this.setState({ running: true, error: null });

    // Clear the scene before running the script
    resetScene();

    try {
      // Create the scripting API
      const api = this._createScriptingAPI();

      // Create an async function with the API in scope
      const scriptFunction = new Function(
        'createBrick',
        'moveBrick',
        'deleteBrick',
        'setBrickColor',
        'clearScene',
        'getBricks',
        'brick',
        'getBrickId',
        'wait',
        'createGrid',
        'setTopView',
        'setFrontView',
        'setSideView',
        'setIsometricView',
        'resetView',
        'zoomIn',
        'zoomOut',
        'setCameraPosition',
        'setCameraTarget',
        'setCameraView',
        'getCameraPosition',
        'getCameraTarget',
        `return (async () => {
          ${scriptText}
        })();`
      );

      // Execute the script with the API
      await scriptFunction(
        api.createBrick,
        api.moveBrick,
        api.deleteBrick,
        api.setBrickColor,
        api.clearScene,
        api.getBricks,
        api.brick,
        api.getBrickId,
        api.wait,
        api.createGrid,
        api.setTopView,
        api.setFrontView,
        api.setSideView,
        api.setIsometricView,
        api.resetView,
        api.zoomIn,
        api.zoomOut,
        api.setCameraPosition,
        api.setCameraTarget,
        api.setCameraView,
        api.getCameraPosition,
        api.getCameraTarget
      );

      this.setState({ running: false, syntaxWarning: null });
    } catch (err) {
      this.setState({
        running: false,
        error: err.message
      });
    }
  }

  _handleStop = () => {
    // Note: This won't actually stop a running script
    // Would need more complex execution control for that
    this.setState({ running: false });
  }

  _toggleCheatsheet = () => {
    this.setState({ cheatsheetOpen: !this.state.cheatsheetOpen });
  }

  _handleExportScript = () => {
    const { scriptText } = this.props;
    const blob = new Blob([scriptText], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'codeblocks-script.js';
    link.click();
    URL.revokeObjectURL(url);
  }

  _handleImportScript = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const importedText = event.target.result;
      const syntaxWarning = importedText.trim() ? this._validateJavaScriptSyntax(importedText) : null;

      this.props.onScriptChange(importedText, true);
      this.setState({
        error: null,
        syntaxWarning,
      });
    };
    reader.readAsText(file);
  }

  _handleLoadExample = (e) => {
    const exampleId = e.target.value;
    if (!exampleId) return;

    const example = examplesList.find(ex => ex.id === exampleId);
    if (example) {
      const syntaxWarning = example.code.trim() ? this._validateJavaScriptSyntax(example.code) : null;

      this.props.onScriptChange(example.code, true);
      this.setState({
        error: null,
        syntaxWarning,
      });
    }

    // Reset dropdown to placeholder
    e.target.value = '';
  }

  _renderCheatsheet() {
    return (
      <div className={styles.cheatsheet}>
        <div className={styles.cheatsheetHeader}>
          <div className={styles.cheatsheetTitle}>API Reference</div>
          <button className={styles.closeButton} onClick={this._toggleCheatsheet}>
            <i className="ion-close" />
          </button>
        </div>
        <div className={styles.cheatsheetContent}>
          <div className={styles.apiSection}>
            <h3>🎨 Two Programming Styles!</h3>
            <p>CodeBlocks supports both functional and object-oriented programming!</p>
          </div>

          <div className={styles.apiSection}>
            <h3>createBrick(options)</h3>
            <p>Creates a new brick. Returns a brick object you can chain!</p>
            <pre>{`// Functional style
createBrick({
  type: 'rectangle',
  color: '#ff6b35',
  position: { x: 0, y: 12, z: 0 },
  dimensions: { x: 2, z: 2 }
});

// OOP style - chain methods!
const myBrick = createBrick({
  color: 'red',
  position: { x: 0, y: 12, z: 0 }
});

await myBrick
  .wait(500)
  .color('blue')
  .wait(500)
  .move({ x: 50, y: 12, z: 0 });`}</pre>
          </div>

          <div className={styles.apiSection}>
            <h3>brick(brickId)</h3>
            <p>Get an existing brick by ID to use OOP methods.</p>
            <pre>{`const myBrick = brick(brickId);
await myBrick.color('green').wait(200).moveBy({ x: 25 });`}</pre>
          </div>

          <div className={styles.apiSection}>
            <h3>Chainable Brick Methods</h3>
            <p>These methods can be chained together!</p>
            <pre>{`brick.color('#ff0000')      // Change color
brick.move({ x, y, z })      // Move to position
brick.moveBy({ x, y, z })    // Move by offset
brick.rotate(angle)          // Rotate (radians)
brick.wait(ms)               // Pause
brick.delete()               // Remove brick

// Get info (not chainable):
brick.getPosition()
brick.getColor()`}</pre>
          </div>

          <div className={styles.apiSection}>
            <h3>Functional API Methods</h3>
            <p>Traditional function-based approach.</p>
            <pre>{`moveBrick(id, { x: 50, y: 12, z: 50 })
deleteBrick(id)
setBrickColor(id, '#00ff00')
getBrickId(0)  // Get ID of first brick`}</pre>
          </div>

          <div className={styles.apiSection}>
            <h3>Scene Management</h3>
            <pre>{`clearScene()           // Remove all bricks
getBricks()            // Get all brick data
await wait(1000)       // Wait 1 second`}</pre>
          </div>

          <div className={styles.apiSection}>
            <h3>createGrid(width, depth, options)</h3>
            <p>Creates a grid of bricks. Returns array of brick objects.</p>
            <pre>{`const bricks = await createGrid(5, 5, {
  color: '#ff6b35',
  type: 'plate',
  animate: true,
  delay: 50
});

// Animate each brick in the grid!
for (const b of bricks) {
  await b.color('rainbow'.split('')[Math.random() * 7 | 0]);
}`}</pre>
          </div>

          <div className={styles.apiSection}>
            <h3>Camera Controls</h3>
            <p>Change the view to see your creations from different angles!</p>
            <pre>{`await setTopView()        // Look from above
await setFrontView()      // Front view
await setSideView()       // Side view
await setIsometricView()  // Cool 3D angle
await resetView()         // Back to start
await zoomIn()            // Get closer
await zoomOut()           // Move away

// Example: Spin the view!
for (let i = 0; i < 4; i++) {
  await setSideView();
  await wait(500);
  await setFrontView();
  await wait(500);
}`}</pre>
          </div>

          <div className={styles.apiSection}>
            <h3>Custom Camera Control</h3>
            <p>Move the camera to any position for motion tracking and cinematic effects!</p>
            <pre>{`// Set camera position (where camera is)
await setCameraPosition(1000, 500, 1000);

// Set camera target (where camera looks)
await setCameraTarget(0, 50, 0);

// Set both position and target at once
await setCameraView(
  { x: 800, y: 600, z: 800 },  // position
  { x: 0, y: 100, z: 0 }        // target
);

// Get current camera position
const pos = getCameraPosition();
console.log(pos.x, pos.y, pos.z);

// Get current camera target
const target = getCameraTarget();

// Example: Follow a moving brick!
const brick = createBrick({
  color: 'red',
  position: { x: 0, y: 12, z: 0 }
});

for (let i = 0; i < 10; i++) {
  await brick.moveBy({ x: 25 });
  const brickPos = brick.getPosition();
  await setCameraView(
    { x: brickPos.x + 200, y: 200, z: 200 },
    { x: brickPos.x, y: brickPos.y, z: brickPos.z }
  );
  await wait(300);
}`}</pre>
          </div>

          <div className={styles.apiSection}>
            <h3>Available Brick Types</h3>
            <p>rectangle, cylinder, cone, slope45, slope33, wedge, arch, curve, plate, tile</p>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { error, running, cheatsheetOpen, syntaxWarning } = this.state;
    const { onClose, scriptText } = this.props;

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>Script Editor</div>
          <button className={styles.closeButton} onClick={onClose}>
            <i className="ion-close" />
          </button>
        </div>

        {error && (
          <div className={styles.error}>
            <i className="ion-alert-circled" /> {error}
          </div>
        )}

        {syntaxWarning && !error && (
          <div className={styles.warning}>
            <i className="ion-alert" /> {syntaxWarning}
          </div>
        )}

        <div className={styles.toolbar}>
          <button
            className={styles.button}
            onClick={this._handleRun}
            disabled={running}>
            <i className="ion-play" /> {running ? 'Running...' : 'Run Script'}
          </button>
          <select
            className={styles.exampleSelect}
            onChange={this._handleLoadExample}
            disabled={running}>
            <option value="">Load Example...</option>
            {examplesList.map(example => (
              <option key={example.id} value={example.id}>
                {example.name}
              </option>
            ))}
          </select>
          <button
            className={styles.button}
            onClick={this._handleExportScript}>
            <i className="ion-download" /> Export
          </button>
          <label className={styles.button}>
            <i className="ion-upload" /> Import
            <input
              type="file"
              accept=".js"
              onChange={this._handleImportScript}
              style={{ display: 'none' }}
            />
          </label>
          <button
            className={styles.button}
            onClick={this._toggleCheatsheet}>
            <i className="ion-help-circled" /> API Reference
          </button>
        </div>

        <textarea
          className={styles.textarea}
          value={scriptText}
          onChange={this._handleScriptChange}
          spellCheck={false}
          disabled={running}
        />

        {cheatsheetOpen && this._renderCheatsheet()}
      </div>
    );
  }
}


export default ScriptEditor;
