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
            <h2 className={styles.sectionTitle}>🎮 How to Play</h2>
            <p>CodeBlocks is your virtual LEGO world where you can build anything and learn programming!</p>
            <ul>
              <li><strong>Build Mode:</strong> Click on the grid to add new bricks</li>
              <li><strong>Paint Mode:</strong> Click bricks to change their colors</li>
              <li><strong>Delete:</strong> Hold Shift and click a brick to remove it</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>🕹️ Moving Around</h2>
            <ul>
              <li><strong>Spin the camera:</strong> Left click and drag</li>
              <li><strong>Move the camera:</strong> Right click and drag</li>
              <li><strong>Zoom in/out:</strong> Scroll with your mouse wheel</li>
              <li><strong>Show/hide grid:</strong> Click the Grid button</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>💻 Programming Commands</h2>
            <p>Click the "Script" button to write code that builds for you! Here are the magic commands:</p>

            <div className={styles.codeBlock}>
              <code>createBrick(options)</code>
              <p>Make a new brick appear!</p>
              <pre>{`createBrick({
  type: 'rectangle',        // What shape?
  color: '#ff0000',         // What color? (red)
  position: { x: 0, y: 24, z: 0 },
  dimensions: { x: 2, z: 2 } // How big?
})`}</pre>
            </div>

            <div className={styles.codeBlock}>
              <code>wait(milliseconds)</code>
              <p>Wait before the next brick (makes cool animations!)</p>
              <pre>{`await wait(100); // Wait a tiny bit`}</pre>
            </div>

            <div className={styles.codeBlock}>
              <code>createGrid(width, depth, options)</code>
              <p>Make a whole floor of bricks at once!</p>
              <pre>{`createGrid(5, 5, {
  type: 'plate',
  color: '#888888'
});`}</pre>
            </div>

            <div className={styles.codeBlock}>
              <code>clearScene()</code>
              <p>Remove all bricks and start fresh!</p>
              <pre>{`clearScene();`}</pre>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>🧱 Cool Brick Shapes</h2>
            <p>Try different shapes when building! Here are all the types:</p>
            <ul className={styles.brickList}>
              <li>rectangle</li>
              <li>cylinder</li>
              <li>cone</li>
              <li>slope45</li>
              <li>slope33</li>
              <li>wedge</li>
              <li>arch</li>
              <li>curve</li>
              <li>plate (flat)</li>
              <li>tile (super flat)</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>💡 Fun Tips!</h2>
            <ul>
              <li>Click "Load Example..." in the Script editor to see cool example code</li>
              <li>Use <code>await wait(100)</code> in your code to make bricks appear one at a time</li>
              <li>Save your creations using the JSON button (it's like a recipe for your build!)</li>
              <li>Try making patterns with loops in your code - like towers or grids!</li>
              <li>Mix different colors and shapes to build awesome structures</li>
            </ul>
          </section>
        </div>
      </div>
    );
  }
}


export default InstructionsModal;
