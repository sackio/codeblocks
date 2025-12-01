import React from 'react';
import Brick from 'components/engine/Brick';

import styles from 'styles/components/script-editor';


class ScriptEditor extends React.Component {
  state = {
    scriptText: '',
    error: null,
    running: false,
    cheatsheetOpen: false,
  }

  componentDidMount() {
    this._generateScriptFromBricks();
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
      const color = brick._color;
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

    this.setState({ scriptText: script });
  }

  _handleScriptChange = (e) => {
    this.setState({
      scriptText: e.target.value,
      error: null,
    });
  }

  _createScriptingAPI = () => {
    const { addObject, removeObject, updateObject, resetScene, bricks } = this.props;

    return {
      // Create a brick with specified options
      createBrick: (options = {}) => {
        const {
          type = 'rectangle',
          color = '#ff6b35',
          position = { x: 0, y: 12, z: 0 },
          rotation = 0,
          dimensions = { x: 2, z: 2, type: type }
        } = options;

        // Create fake intersect for Brick constructor
        const fakeIntersect = {
          point: new THREE.Vector3(position.x, position.y, position.z),
          face: { normal: new THREE.Vector3(0, 1, 0) }
        };

        const brick = new Brick(fakeIntersect, color, dimensions, rotation, 0);
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
          brick.updateColor(color);
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
            const id = this.createBrick({
              color,
              type,
              position: { x: x * spacing, y: 12, z: z * spacing },
              dimensions: { x: 2, z: 2, type }
            });
            ids.push(id);
            if (animate) {
              await this.wait(delay);
            }
          }
        }
        return ids;
      },
    };
  }

  _handleRun = async () => {
    const { scriptText } = this.state;

    this.setState({ running: true, error: null });

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

      this.setState({ running: false });
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
      this.setState({
        scriptText: event.target.result,
        error: null,
      });
    };
    reader.readAsText(file);
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
    const { scriptText, error, running, cheatsheetOpen } = this.state;
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

        <div className={styles.toolbar}>
          <button
            className={styles.button}
            onClick={this._handleRun}
            disabled={running}>
            <i className="ion-play" /> {running ? 'Running...' : 'Run Script'}
          </button>
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
