import React from 'react';
import Brick from 'components/engine/Brick';
import { RGBAToHexString } from 'utils';
import { examplesList } from 'utils/examples';

import styles from 'styles/components/script-editor';


class ScriptEditor extends React.Component {
  state = {
    scriptText: '',
    error: null,
    running: false,
    cheatsheetOpen: false,
    userModified: false,
    syntaxWarning: null,
  }

  componentDidMount() {
    this._generateScriptFromBricks();
  }

  componentDidUpdate(prevProps) {
    // Only regenerate if bricks changed AND user hasn't modified the script
    if (prevProps.bricks !== this.props.bricks && !this.state.userModified) {
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
    const { bricks } = this.props;

    if (bricks.length === 0) {
      this.setState({
        scriptText: `// Example: Create a colorful tower
for (let i = 0; i < 5; i++) {
  createBrick({
    color: ['red', 'blue', 'green', 'yellow', 'orange'][i],
    position: { x: 0, y: i * 24, z: 0 },
    dimensions: { x: 2, z: 2 }
  });
  await wait(300);
}`
      });
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

    this.setState({ scriptText: script, syntaxWarning: null });
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
        'wait',
        'createGrid',
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

    this.setState({
      scriptText: newText,
      error: null,
      userModified: true,
      syntaxWarning,
    });
  }

  _createScriptingAPI = () => {
    const { addObject, removeObject, updateObject, resetScene, bricks } = this.props;

    const api = {
      // Create a brick with specified options
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
        return brick.customId;
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

      // Get all bricks
      getBricks: () => {
        return bricks.map(b => ({
          id: b.customId,
          position: { x: b.position.x, y: b.position.y, z: b.position.z },
          color: b._color,
          dimensions: b._dimensions,
        }));
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
    };

    return api;
  }

  _handleRun = async () => {
    const { scriptText } = this.state;
    const { resetScene } = this.props;

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
        'wait',
        'createGrid',
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
        api.wait,
        api.createGrid
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
    const { scriptText } = this.state;
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

      this.setState({
        scriptText: importedText,
        error: null,
        userModified: true,
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

      this.setState({
        scriptText: example.code,
        error: null,
        userModified: true,
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
            <h3>createBrick(options)</h3>
            <p>Creates a new brick in the scene.</p>
            <pre>{`createBrick({
  type: 'rectangle',      // brick type
  color: '#ff6b35',       // hex color
  position: { x: 0, y: 12, z: 0 },
  rotation: 0,            // radians
  dimensions: { x: 2, z: 2 }
})`}</pre>
          </div>

          <div className={styles.apiSection}>
            <h3>moveBrick(id, position)</h3>
            <p>Moves an existing brick to a new position.</p>
            <pre>{`moveBrick(brickId, { x: 50, y: 12, z: 50 })`}</pre>
          </div>

          <div className={styles.apiSection}>
            <h3>deleteBrick(id)</h3>
            <p>Removes a brick from the scene.</p>
            <pre>{`deleteBrick(brickId)`}</pre>
          </div>

          <div className={styles.apiSection}>
            <h3>setBrickColor(id, color)</h3>
            <p>Changes the color of an existing brick.</p>
            <pre>{`setBrickColor(brickId, '#00ff00')`}</pre>
          </div>

          <div className={styles.apiSection}>
            <h3>clearScene()</h3>
            <p>Removes all bricks from the scene.</p>
            <pre>{`clearScene()`}</pre>
          </div>

          <div className={styles.apiSection}>
            <h3>getBricks()</h3>
            <p>Returns array of all bricks with their properties.</p>
            <pre>{`const bricks = getBricks()`}</pre>
          </div>

          <div className={styles.apiSection}>
            <h3>wait(ms)</h3>
            <p>Pauses script execution for specified milliseconds. Use with await.</p>
            <pre>{`await wait(1000)  // wait 1 second`}</pre>
          </div>

          <div className={styles.apiSection}>
            <h3>createGrid(width, depth, options)</h3>
            <p>Creates a grid of bricks. Returns array of brick IDs.</p>
            <pre>{`await createGrid(5, 5, {
  color: '#ff6b35',
  animate: true,
  delay: 100
})`}</pre>
          </div>

          <div className={styles.apiSection}>
            <h3>Available Brick Types</h3>
            <p>rectangle, cylinder, cone, slope45, slope33, slopeInverted, wedge, arch, curve, cornerInside, cornerOutside, cornerRound, plate, tile</p>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { scriptText, error, running, cheatsheetOpen, syntaxWarning } = this.state;
    const { onClose } = this.props;

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
