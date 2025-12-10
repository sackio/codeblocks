import React from 'react';
import Joyride from 'react-joyride';


class TutorialWalkthrough extends React.Component {
  state = {
    run: false,
    stepIndex: 0,
  };

  start = () => {
    this.setState({
      run: true,
      stepIndex: 0,
    });
  }

  steps = [
    // Step 1: Welcome
    {
      selector: '[class*="logo"]',
      text: (
        <div>
          <h3>Welcome to CodeBlocks!</h3>
          <p>Your virtual LEGO world where you can build anything and learn programming!</p>
          <p>This quick tour will show you everything you can do. Let's get started!</p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },

    // Step 2: Build Mode
    {
      selector: '[data-mode="build"]',
      text: (
        <div>
          <h3>Build Mode</h3>
          <p>This is where the fun begins! Click here to enter <strong>Build Mode</strong>.</p>
          <p>In Build Mode, you can click on the grid to add new bricks to your creation.</p>
        </div>
      ),
      placement: 'bottom',
    },

    // Step 3: Adding First Brick
    {
      selector: '[class*="scene"]',
      text: (
        <div>
          <h3>Adding Your First Brick</h3>
          <p>Try clicking anywhere on the grid to place a brick!</p>
          <p>Each click adds a new brick at that spot. Build something cool!</p>
        </div>
      ),
      placement: 'top',
    },

    // Step 4: Paint Mode
    {
      selector: '[data-mode="paint"]',
      text: (
        <div>
          <h3>Paint Mode</h3>
          <p>Want to change colors? Switch to <strong>Paint Mode</strong>!</p>
          <p>In Paint Mode, clicking a brick will change its color to your selected color.</p>
        </div>
      ),
      placement: 'bottom',
    },

    // Step 5: Color Picker - Basic
    {
      selector: '.color-picker, [class*="color-picker"]',
      text: (
        <div>
          <h3>Color Picker - Basic Colors</h3>
          <p>Choose from these preset colors by clicking on them.</p>
          <p>Pick your favorite color and use it to paint your bricks!</p>
        </div>
      ),
      placement: 'bottom',
    },

    // Step 6: Color Picker - Advanced
    {
      selector: '.color-picker, [class*="color-picker"]',
      text: (
        <div>
          <h3>Color Picker - Advanced</h3>
          <p>Click the color swatch to open the <strong>full color wheel</strong>!</p>
          <p>You can pick any color you want and even adjust the opacity (transparency).</p>
          <p>Make your bricks see-through or solid - it's up to you!</p>
        </div>
      ),
      placement: 'bottom',
    },

    // Step 7: Edit Mode
    {
      selector: '[data-mode="edit"]',
      text: (
        <div>
          <h3>Edit Mode</h3>
          <p>Need to move or rotate a brick? Use <strong>Edit Mode</strong>!</p>
          <p>In Edit Mode, you can drag bricks to new positions and rotate them.</p>
        </div>
      ),
      placement: 'bottom',
    },

    // Step 8: Delete Bricks
    {
      selector: '[class*="scene"]',
      text: (
        <div>
          <h3>Deleting Bricks</h3>
          <p>Made a mistake? No problem!</p>
          <p>Hold down the <strong>Shift</strong> key and click any brick to delete it.</p>
          <p>This works in any mode!</p>
        </div>
      ),
      placement: 'top',
    },

    // Step 9: Brick Shapes
    {
      selector: '.brick-picker, [class*="brick-picker"]',
      text: (
        <div>
          <h3>Brick Shapes</h3>
          <p>CodeBlocks has lots of different brick shapes!</p>
          <p>Try: rectangle, cylinder, cone, slope45, slope33, wedge, arch, curve, plate (flat), and tile (super flat).</p>
          <p>Mix different shapes to build awesome structures!</p>
        </div>
      ),
      placement: 'right',
    },

    // Step 10: Undo/Redo
    {
      selector: '[class*="undo"], .undo-button',
      text: (
        <div>
          <h3>Undo & Redo</h3>
          <p>Fix mistakes easily with <strong>Undo</strong> and <strong>Redo</strong> buttons!</p>
          <p>You can undo your last action or redo something you undid.</p>
          <p>Don't be afraid to experiment - you can always undo!</p>
        </div>
      ),
      placement: 'bottom',
    },

    // Step 11: Camera - Mouse Controls
    {
      selector: '[class*="scene"]',
      text: (
        <div>
          <h3>Camera Controls - Mouse</h3>
          <p>Move the camera to see your build from different angles:</p>
          <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
            <li><strong>Spin:</strong> Left click and drag</li>
            <li><strong>Pan:</strong> Right click and drag</li>
            <li><strong>Zoom:</strong> Scroll with mouse wheel</li>
          </ul>
        </div>
      ),
      placement: 'top',
    },

    // Step 12: Camera - Buttons
    {
      selector: '[class*="camera"], .camera-controls',
      text: (
        <div>
          <h3>Camera View Buttons</h3>
          <p>Use these quick view buttons to jump to different angles instantly!</p>
          <p>Try <strong>Top</strong>, <strong>Front</strong>, <strong>Side</strong>, and <strong>Iso</strong> (isometric) views.</p>
        </div>
      ),
      placement: 'right',
    },

    // Step 13: Grid Toggle
    {
      selector: '[class*="grid"]',
      text: (
        <div>
          <h3>Grid Toggle</h3>
          <p>Want a cleaner view? Click the <strong>Grid</strong> button to show or hide the building grid.</p>
          <p>The grid helps you place bricks precisely, but sometimes it's nice to see your creation without it!</p>
        </div>
      ),
      placement: 'bottom',
    },

    // Step 14: Script Editor Intro
    {
      selector: '[class*="script"]',
      text: (
        <div>
          <h3>Script Editor - Programming!</h3>
          <p>Ready to learn coding? Click <strong>Script</strong> to open the programming editor!</p>
          <p>You can write JavaScript code to build automatically.</p>
          <p>It's like magic - your code brings bricks to life!</p>
        </div>
      ),
      placement: 'bottom',
    },

    // Step 15: Script Examples
    {
      selector: '[class*="script-editor"]',
      text: (
        <div>
          <h3>Built-in Examples</h3>
          <p>Click <strong>"Load Example..."</strong> in the Script editor to see cool example code!</p>
          <p>There are 30+ examples from beginner to advanced.</p>
          <p>Study them, modify them, and learn how they work!</p>
        </div>
      ),
      placement: 'left',
      spotlightClicks: true,
    },

    // Step 16: Script API - createBrick()
    {
      selector: '[class*="script-editor"]',
      text: (
        <div>
          <h3>createBrick() Command</h3>
          <p>The main command to create bricks with code:</p>
          <pre style={{
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '10px',
            borderRadius: '4px',
            color: '#ffd700',
            fontSize: '13px',
            marginTop: '10px'
          }}>{`createBrick({
  type: 'rectangle',
  color: '#ff0000',
  position: { x: 0, y: 24, z: 0 },
  dimensions: { x: 2, z: 2 }
});`}</pre>
        </div>
      ),
      placement: 'left',
      spotlightClicks: true,
    },

    // Step 17: Script API - Camera Commands
    {
      selector: '[class*="script-editor"]',
      text: (
        <div>
          <h3>Camera Commands</h3>
          <p>Control the camera view in your scripts:</p>
          <pre style={{
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '10px',
            borderRadius: '4px',
            color: '#ffd700',
            fontSize: '13px',
            marginTop: '10px'
          }}>{`await setTopView();
await setFrontView();
await setSideView();
await zoomIn();
await zoomOut();`}</pre>
          <p style={{ marginTop: '10px' }}>Use <code>await wait(1000)</code> to pause between actions!</p>
        </div>
      ),
      placement: 'left',
      spotlightClicks: true,
    },

    // Step 18: JSON Editor
    {
      selector: '[class*="json"]',
      text: (
        <div>
          <h3>JSON Editor - Save & Load</h3>
          <p>Click <strong>JSON</strong> to save your creation!</p>
          <p>JSON is like a recipe for your build - it saves the position and color of every brick.</p>
          <p>You can export it to a file and load it later!</p>
        </div>
      ),
      placement: 'bottom',
    },

    // Step 19: Build Manager
    {
      selector: '[class*="builds"]',
      text: (
        <div>
          <h3>Build Manager</h3>
          <p>Click <strong>Builds</strong> to manage your saved creations!</p>
          <p>Save your current build with a name, or load a previously saved build.</p>
          <p>Your builds are saved in your browser's storage.</p>
        </div>
      ),
      placement: 'bottom',
    },

    // Step 20: Reset & Finish
    {
      selector: '[class*="reset"]',
      text: (
        <div>
          <h3>You're All Set!</h3>
          <p>You now know everything about CodeBlocks!</p>
          <p>The <strong>Reset</strong> button clears the scene when you want to start fresh.</p>
          <p>Have fun building and coding! Remember: there are no mistakes, only happy accidents. 🎨</p>
        </div>
      ),
      placement: 'bottom',
    },
  ];

  handleJoyrideCallback = (data) => {
    const { action, index, type } = data;

    // Handle step transitions with interactive actions
    if (type === 'step:after' || type === 'error:target_not_found') {
      const nextStepIndex = index + (action === 'back' ? -1 : 1);

      // Trigger mode changes at specific steps
      if (index === 1 && action === 'next') {
        // After Build Mode step, set mode to build
        if (this.props.onSetMode) {
          this.props.onSetMode('build');
        }
      }

      if (index === 3 && action === 'next') {
        // After Paint Mode step, set mode to paint
        if (this.props.onSetMode) {
          this.props.onSetMode('paint');
        }
      }

      if (index === 6 && action === 'next') {
        // After Edit Mode step, set mode to edit
        if (this.props.onSetMode) {
          this.props.onSetMode('edit');
        }
      }

      if (index === 13 && action === 'next') {
        // After Script Editor Intro step, open script editor
        if (this.props.onOpenScriptEditor) {
          setTimeout(() => {
            this.props.onOpenScriptEditor();
          }, 300);
        }
      }

      if (index === 17 && action === 'next') {
        // Close script editor before JSON step
        if (this.props.onCloseScriptEditor) {
          this.props.onCloseScriptEditor();
        }
      }

      // Update step index
      this.setState({ stepIndex: nextStepIndex });
    }

    // Handle tour completion or skip
    if (type === 'finished') {
      this.setState({
        run: false,
        stepIndex: 0,
      });

      // Reset app state
      if (this.props.onReset) {
        this.props.onReset();
      }
    }
  };

  render() {
    const { run, stepIndex } = this.state;

    return (
      <Joyride
        steps={this.steps}
        run={run}
        stepIndex={stepIndex}
        callback={this.handleJoyrideCallback}
        type="continuous"
        showProgress={true}
        showSkipButton={true}
        scrollToFirstStep={true}
        disableScrolling={false}
        disableOverlayClose={false}
        spotlightClicks={false}
        styles={{
          options: {
            arrowColor: '#667eea',
            backgroundColor: '#667eea',
            overlayColor: 'rgba(0, 0, 0, 0.5)',
            primaryColor: '#FF9800',
            textColor: '#ffffff',
            width: 400,
            zIndex: 10000,
          },
          tooltip: {
            borderRadius: 12,
            padding: 0,
          },
          tooltipContainer: {
            textAlign: 'left',
          },
          tooltipTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            padding: '16px 20px',
            margin: 0,
            background: 'rgba(255, 255, 255, 0.15)',
            borderBottom: '2px solid rgba(255, 255, 255, 0.2)',
          },
          tooltipContent: {
            padding: '20px',
            fontSize: 16,
            lineHeight: 1.6,
          },
          tooltipFooter: {
            background: 'rgba(0, 0, 0, 0.15)',
            padding: '12px 20px',
            marginTop: 0,
          },
          buttonNext: {
            background: '#FF9800',
            borderRadius: 8,
            padding: '10px 20px',
            fontSize: 15,
            fontWeight: 'bold',
            outline: 'none',
          },
          buttonBack: {
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 8,
            padding: '10px 20px',
            fontSize: 15,
            fontWeight: 'bold',
            color: '#ffffff',
            marginRight: 10,
            outline: 'none',
          },
          buttonSkip: {
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 8,
            padding: '8px 16px',
            fontSize: 13,
            color: '#ffffff',
            outline: 'none',
          },
          buttonClose: {
            color: '#ffffff',
            padding: 5,
            outline: 'none',
          },
          spotlight: {
            borderRadius: 4,
          },
          beacon: {
            outline: 'none',
          },
        }}
        locale={{
          back: 'Back',
          close: 'Close',
          last: 'Finish',
          next: 'Next',
          skip: 'Skip Tutorial',
        }}
      />
    );
  }
}


export default TutorialWalkthrough;
