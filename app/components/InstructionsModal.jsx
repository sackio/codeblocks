import React from 'react';

import styles from 'styles/components/instructions-modal';


class InstructionsModal extends React.Component {
  render() {
    const { onClose } = this.props;

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>CodeBlocks Help</div>
          <button className={styles.closeButton} onClick={onClose}>
            <i className="ion-close" />
          </button>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Getting Started</h2>
            <p>CodeBlocks is a 3D brick building application with scripting capabilities.</p>
            <ul>
              <li><strong>Build Mode:</strong> Click to place bricks in the scene</li>
              <li><strong>Paint Mode:</strong> Click existing bricks to change their color</li>
              <li><strong>Delete:</strong> Hold Shift and click a brick to remove it</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Controls</h2>
            <ul>
              <li><strong>Rotate View:</strong> Left click + drag</li>
              <li><strong>Pan View:</strong> Right click + drag</li>
              <li><strong>Zoom:</strong> Mouse wheel</li>
              <li><strong>Toggle Grid:</strong> Use the Grid button in the Scene section</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Scripting API</h2>
            <p>Use the Script editor to create automated builds. Available functions:</p>

            <div className={styles.codeBlock}>
              <code>createBrick(options)</code>
              <p>Create a new brick in the scene.</p>
              <pre>{`createBrick({
  type: 'rectangle',        // Shape type
  color: '#ff0000',         // Hex color
  position: { x: 0, y: 24, z: 0 },
  rotation: 0,              // Rotation in radians (optional)
  dimensions: { x: 2, z: 2 } // Size (optional)
})`}</pre>
            </div>

            <div className={styles.codeBlock}>
              <code>deleteBrick(id)</code>
              <p>Remove a brick by its ID.</p>
              <pre>{`const brick = createBrick({ /* ... */ });
deleteBrick(brick.id);`}</pre>
            </div>

            <div className={styles.codeBlock}>
              <code>setBrickColor(id, color)</code>
              <p>Change the color of an existing brick.</p>
              <pre>{`setBrickColor(brick.id, '#00ff00');`}</pre>
            </div>

            <div className={styles.codeBlock}>
              <code>clearScene()</code>
              <p>Remove all bricks from the scene.</p>
              <pre>{`clearScene();`}</pre>
            </div>

            <div className={styles.codeBlock}>
              <code>wait(milliseconds)</code>
              <p>Pause execution for animation effects. Must use with await.</p>
              <pre>{`await wait(100); // Wait 100ms`}</pre>
            </div>

            <div className={styles.codeBlock}>
              <code>createGrid(width, depth, options)</code>
              <p>Create a grid of bricks.</p>
              <pre>{`createGrid(5, 5, {
  type: 'plate',
  color: '#888888',
  spacing: 25
});`}</pre>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Brick Types</h2>
            <p>Available brick shapes:</p>
            <ul className={styles.brickList}>
              <li>rectangle</li>
              <li>cylinder</li>
              <li>cone</li>
              <li>slope45</li>
              <li>slope33</li>
              <li>slopeInverted</li>
              <li>wedge</li>
              <li>arch</li>
              <li>curve</li>
              <li>cornerInside</li>
              <li>cornerOutside</li>
              <li>cornerRound</li>
              <li>plate</li>
              <li>tile</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Tips</h2>
            <ul>
              <li>Use the "Generate Script" button to see the code for your current build</li>
              <li>Check out the example scripts for inspiration</li>
              <li>Use <code>await wait()</code> to create animated building sequences</li>
              <li>Export your builds as JSON for later use</li>
              <li>Scripts run in an async context, so you can use async/await</li>
            </ul>
          </section>
        </div>
      </div>
    );
  }
}


export default InstructionsModal;
