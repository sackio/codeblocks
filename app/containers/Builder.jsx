import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import {
  getMode,
  getColor,
  getIsGridVisible,
  getBrickDimensions,
  getBricks,
  getCanUndo,
  getCanRedo,
} from 'selectors';
import {
  setMode,
  setColor,
  toggleGrid,
  setBrick,
  addBrick,
  removeBrick,
  updateBrick,
  resetScene,
  setScene,
  undo,
  redo,
} from 'actions';
import Scene from 'components/engine/Scene';
import Topbar from 'components/Topbar';
import JSONEditor from 'components/JSONEditor';
import ScriptEditor from 'components/ScriptEditor';
import InstructionsModal from 'components/InstructionsModal';
import Tutorial from 'components/Tutorial';
import BuildManager from 'components/BuildManager';

import styles from 'styles/containers/builder';


class Builder extends React.Component {
  state = {
    jsonEditorOpen: false,
    scriptEditorOpen: false,
    instructionsOpen: false,
    buildManagerOpen: false,
    scriptText: '',
    scriptUserModified: false,
  }

  componentDidMount() {
    this.tutorial = new Tutorial();

    // Autosave disabled - causing issues
    // this.sceneInitTimer = setTimeout(() => {
    //   this._loadAutosave();
    // }, 1000);
  }

  componentWillUnmount() {
    // Clear timers
    if (this.autosaveTimer) {
      clearTimeout(this.autosaveTimer);
    }
    if (this.sceneInitTimer) {
      clearTimeout(this.sceneInitTimer);
    }
  }

  // Autosave disabled - causing issues
  // componentDidUpdate(prevProps, prevState) {
  //   // Autosave when bricks or script changes
  //   const bricksChanged = prevProps.bricks !== this.props.bricks;
  //   const scriptChanged = prevState.scriptText !== this.state.scriptText;

  //   if (bricksChanged || scriptChanged) {
  //     this._scheduleAutosave();
  //   }
  // }

  _scheduleAutosave = () => {
    // Debounce autosave - only save after 2 seconds of no changes
    if (this.autosaveTimer) {
      clearTimeout(this.autosaveTimer);
    }
    this.autosaveTimer = setTimeout(() => {
      this._autosave();
    }, 2000);
  }

  _serializeBricks = (bricks) => {
    // Extract only the serializable data from Brick objects
    if (!Array.isArray(bricks)) {
      return [];
    }

    return bricks.map((brick) => {
      // Handle both Brick instances (with private properties) and plain objects (from loaded autosave)
      // For Brick instances, private properties start with underscore: _color, _dimensions, etc.
      // For plain objects from autosave, use the public properties: color, dimensions, etc.
      const color = brick._color || brick.color;
      const dimensions = brick._dimensions || brick.dimensions;
      const translation = brick._translation !== undefined ? brick._translation : brick.translation;
      const intersect = brick._intersect || brick.intersect;

      return {
        customId: brick.customId,
        position: {
          x: brick.position.x,
          y: brick.position.y,
          z: brick.position.z
        },
        rotation: {
          y: brick.rotation.y
        },
        color: color,
        dimensions: dimensions,
        translation: translation,
        // Store intersect data for recreation
        intersect: intersect ? {
          point: {
            x: intersect.point.x,
            y: intersect.point.y,
            z: intersect.point.z
          },
          face: intersect.face ? {
            normal: {
              x: intersect.face.normal.x,
              y: intersect.face.normal.y,
              z: intersect.face.normal.z
            }
          } : null
        } : null
      };
    });
  }

  _autosave = () => {
    try {
      const { bricks } = this.props;

      // Serialize bricks to plain objects
      const serializedBricks = this._serializeBricks(bricks);

      const autosaveData = {
        version: 1, // For future compatibility
        script: this.state.scriptText || '',
        bricks: serializedBricks,
        timestamp: Date.now(),
      };

      localStorage.setItem('codeblocks_autosave', JSON.stringify(autosaveData));
    } catch (err) {
      console.error('Autosave failed:', err);
      // Clear corrupted autosave
      try {
        localStorage.removeItem('codeblocks_autosave');
      } catch (e) {
        // Ignore - localStorage might be full or disabled
      }
    }
  }

  _loadAutosave = () => {
    try {
      const autosaveData = localStorage.getItem('codeblocks_autosave');
      if (!autosaveData) {
        return;
      }

      const parsed = JSON.parse(autosaveData);

      if (!parsed || !parsed.bricks) {
        throw new Error('Invalid autosave format');
      }

      // Validate data structure
      if (!Array.isArray(parsed.bricks)) {
        throw new Error('Invalid bricks data');
      }

      // Load script
      if (parsed.script && parsed.script.trim()) {
        this.setState({
          scriptText: parsed.script,
          scriptUserModified: true
        });
      }

      // Load bricks
      if (parsed.bricks.length > 0) {
        // Use setScene to load the brick data
        // The Scene component and redux will handle creating the actual Brick objects
        this.props.setScene(parsed.bricks);
      }
    } catch (err) {
      console.error('Failed to load autosave:', err);

      // Clear corrupted autosave
      try {
        localStorage.removeItem('codeblocks_autosave');
      } catch (e) {
        // Ignore
      }
    }
  }

  // Camera control methods for scripting API
  _setTopView = () => {
    if (this.sceneRef) {
      this.sceneRef._setTopView();
    }
  }

  _setFrontView = () => {
    if (this.sceneRef) {
      this.sceneRef._setFrontView();
    }
  }

  _setSideView = () => {
    if (this.sceneRef) {
      this.sceneRef._setSideView();
    }
  }

  _setIsometricView = () => {
    if (this.sceneRef) {
      this.sceneRef._setIsometricView();
    }
  }

  _resetView = () => {
    if (this.sceneRef) {
      this.sceneRef._resetView();
    }
  }

  _zoomIn = () => {
    if (this.sceneRef) {
      this.sceneRef._zoomIn();
    }
  }

  _zoomOut = () => {
    if (this.sceneRef) {
      this.sceneRef._zoomOut();
    }
  }

  // Custom camera position and target methods for scripting
  _setCameraPosition = (x, y, z) => {
    if (this.sceneRef) {
      this.sceneRef._setCameraPosition(x, y, z);
    }
  }

  _setCameraTarget = (x, y, z) => {
    if (this.sceneRef) {
      this.sceneRef._setCameraTarget(x, y, z);
    }
  }

  _setCameraView = (position, target) => {
    if (this.sceneRef) {
      this.sceneRef._setCameraView(position, target);
    }
  }

  _getCameraPosition = () => {
    if (this.sceneRef) {
      return this.sceneRef._getCameraPosition();
    }
    return { x: 0, y: 0, z: 0 };
  }

  _getCameraTarget = () => {
    if (this.sceneRef) {
      return this.sceneRef._getCameraTarget();
    }
    return { x: 0, y: 0, z: 0 };
  }

  _captureScreenshot = () => {
    if (this.sceneRef) {
      return this.sceneRef._captureScreenshot();
    }
    return null;
  }

  _toggleJSONEditor = () => {
    this.setState({ jsonEditorOpen: !this.state.jsonEditorOpen });
  }

  _toggleScriptEditor = () => {
    this.setState({ scriptEditorOpen: !this.state.scriptEditorOpen });
  }

  _toggleInstructions = () => {
    this.setState({ instructionsOpen: !this.state.instructionsOpen });
  }

  _toggleBuildManager = () => {
    this.setState({ buildManagerOpen: !this.state.buildManagerOpen });
  }

  _handleScriptChange = (scriptText, userModified) => {
    this.setState({ scriptText, scriptUserModified: userModified });
  }

  _handleLoadBuild = (build) => {
    // Load the script
    if (build.script) {
      this.setState({ scriptText: build.script, scriptUserModified: true });
    }

    // Load the JSON (parse and set scene)
    if (build.json) {
      try {
        const objects = JSON.parse(build.json);

        // Validate that objects is an array and has valid structure
        if (!Array.isArray(objects)) {
          throw new Error('Invalid build data: expected array of objects');
        }

        // Check if objects have the required fields for brick reconstruction
        const hasValidBricks = objects.every(obj =>
          obj && obj.position && obj.color && obj.dimensions
        );

        if (!hasValidBricks) {
          // Show warning to user about corrupted build
          if (window.confirm(
            `Warning: This build contains corrupted data from an older version.\n\n` +
            `The build may not load correctly. Would you like to try loading it anyway?\n\n` +
            `(Corrupted bricks will be skipped)`
          )) {
            this.props.setScene(objects);
          } else {
            return; // User cancelled, don't load
          }
        } else {
          this.props.setScene(objects);
        }
      } catch (err) {
        console.error('Failed to load build:', err);
        alert(`Failed to load build: ${err.message}\n\nThis build may be corrupted. Please try saving a new version of your work.`);
        return; // Don't close the build manager if loading failed
      }
    }

    // Close the build manager
    this.setState({ buildManagerOpen: false });
  }

  _handleSaveBuildSuccess = (buildName) => {
    console.log(`Build "${buildName}" saved successfully`);
  }

  _handleReset = () => {
    if (window.confirm('Are you sure you want to reset the scene? This will delete all bricks.')) {
      this.props.resetScene();
    }
  }

  _handleStartTutorial = () => {
    if (this.tutorial) {
      this.tutorial.start();
    }
  }

  render() {
    const {
      mode,
      setMode,
      color,
      setColor,
      gridVisible,
      toggleGrid,
      dimensions,
      setBrick,
      removeBrick,
      addBrick,
      bricks,
      updateBrick,
      resetScene,
      setScene,
      undo,
      redo,
      canUndo,
      canRedo
    } = this.props;
    const { jsonEditorOpen, scriptEditorOpen, instructionsOpen, buildManagerOpen } = this.state;

    return (
      <div className={styles.builder}>
        <Topbar
          onClickSetMode={setMode}
          onClickSetColor={setColor}
          onClickToggleGrid={toggleGrid}
          mode={mode}
          color={color}
          grid={gridVisible}
          brickSize={dimensions}
          onClickSetBrick={setBrick}
          onClickReset={this._handleReset}
          onClickToggleJSON={this._toggleJSONEditor}
          jsonEditorOpen={jsonEditorOpen}
          onClickToggleScript={this._toggleScriptEditor}
          scriptEditorOpen={scriptEditorOpen}
          onClickToggleInstructions={this._toggleInstructions}
          onClickStartTutorial={this._handleStartTutorial}
          onClickToggleBuildManager={this._toggleBuildManager}
          buildManagerOpen={buildManagerOpen}
          onClickUndo={undo}
          onClickRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
        />
        <Scene
          ref={(ref) => { this.sceneRef = ref; }}
          brickColor={color}
          objects={bricks}
          mode={mode}
          grid={gridVisible}
          dimensions={dimensions}
          // shifted={utilsOpen}
          removeObject={removeBrick}
          addObject={addBrick}
          updateObject={updateBrick}
          undo={undo}
          redo={redo} />
        {jsonEditorOpen && (
          <JSONEditor
            objects={bricks}
            loadObjectsFromJSON={setScene}
            onClose={this._toggleJSONEditor}
            captureScreenshot={this._captureScreenshot}
          />
        )}
        {scriptEditorOpen && (
          <ScriptEditor
            bricks={bricks}
            addObject={addBrick}
            removeObject={removeBrick}
            updateObject={updateBrick}
            resetScene={resetScene}
            onClose={this._toggleScriptEditor}
            setTopView={this._setTopView}
            setFrontView={this._setFrontView}
            setSideView={this._setSideView}
            setIsometricView={this._setIsometricView}
            resetView={this._resetView}
            zoomIn={this._zoomIn}
            zoomOut={this._zoomOut}
            setCameraPosition={this._setCameraPosition}
            setCameraTarget={this._setCameraTarget}
            setCameraView={this._setCameraView}
            getCameraPosition={this._getCameraPosition}
            getCameraTarget={this._getCameraTarget}
            scriptText={this.state.scriptText}
            scriptUserModified={this.state.scriptUserModified}
            onScriptChange={this._handleScriptChange}
            captureScreenshot={this._captureScreenshot}
          />
        )}
        {instructionsOpen && (
          <InstructionsModal
            onClose={this._toggleInstructions}
          />
        )}
        {buildManagerOpen && (
          <BuildManager
            mode="popup"
            scriptText={this.state.scriptText}
            jsonText={JSON.stringify(this._serializeBricks(bricks), null, 2)}
            onLoadBuild={this._handleLoadBuild}
            onSaveSuccess={this._handleSaveBuildSuccess}
            onClose={this._toggleBuildManager}
          />
        )}
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  mode: getMode(state),
  color: getColor(state),
  gridVisible: getIsGridVisible(state),
  dimensions: getBrickDimensions(state),
  bricks: getBricks(state),
  canUndo: getCanUndo(state),
  canRedo: getCanRedo(state),
});


const mapDispatchToProps = {
  setMode,
  setColor,
  toggleGrid,
  setBrick,
  removeBrick,
  addBrick,
  updateBrick,
  resetScene,
  setScene,
  undo,
  redo,
};


export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Builder);
