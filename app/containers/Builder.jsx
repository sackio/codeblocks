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
import TutorialWalkthrough from 'components/TutorialWalkthrough';
import BuildManager from 'components/BuildManager';

import styles from 'styles/containers/builder';


class Builder extends React.Component {
  state = {
    jsonEditorOpen: false,
    scriptEditorOpen: false,
    buildManagerOpen: false,
    scriptText: '',
    scriptUserModified: false,
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

  _toggleBuildManager = () => {
    this.setState({ buildManagerOpen: !this.state.buildManagerOpen });
  }

  _handleScriptChange = (scriptText, userModified) => {
    this.setState({ scriptText, scriptUserModified: userModified });
  }

  _handleLoadBuild = (build) => {
    const { setScene, resetScene } = this.props;

    // Close build manager first
    this.setState({ buildManagerOpen: false });

    // Reset scene before loading
    resetScene();

    // Try script-first approach
    const hasScript = build.script && build.script.trim();

    if (hasScript) {
      // Load script and attempt to execute
      this.setState({
        scriptText: build.script,
        scriptUserModified: true,
        scriptEditorOpen: false,
      }, () => {
        // Open script editor and execute
        this.setState({ scriptEditorOpen: true }, () => {
          // Give editor time to mount
          setTimeout(() => {
            if (this.scriptEditorRef && this.scriptEditorRef._handleRun) {
              try {
                this.scriptEditorRef._handleRun();
              } catch (scriptError) {
                console.error('Script execution failed, falling back to JSON:', scriptError);
                this._loadFromJSON(build.json);
              }
            } else {
              console.warn('ScriptEditor ref not available, falling back to JSON');
              this._loadFromJSON(build.json);
            }
          }, 200);
        });
      });
    } else {
      // No script, load from JSON directly
      this._loadFromJSON(build.json);
    }
  }

  _loadFromJSON = (jsonString) => {
    const { setScene } = this.props;

    if (!jsonString || jsonString.trim() === '') {
      alert('This build has no script and no JSON data.');
      return;
    }

    try {
      // Import deserializeBricks from storage utils
      // We'll add this import at the top of the file
      const parsed = JSON.parse(jsonString);

      if (!Array.isArray(parsed)) {
        throw new Error('Invalid JSON: must be an array');
      }

      // Apply to scene
      setScene(parsed);
    } catch (err) {
      console.error('Failed to load JSON:', err);
      alert(`Failed to load build from JSON: ${err.message}`);
    }
  }

  _handleSaveBuildSuccess = (buildName) => {
    // Build saved successfully
  }

  _handleReset = () => {
    if (window.confirm('Are you sure you want to reset the scene? This will delete all bricks.')) {
      this.props.resetScene();
    }
  }

  _handleStartTutorial = () => {
    if (this.tutorialRef) {
      this.tutorialRef.start();
    }
  }

  _handleResetAfterTutorial = () => {
    this.setState({
      mode: 'build',
      scriptEditorOpen: false,
      jsonEditorOpen: false,
    });
  }

  _handleChangeMode = (mode) => {
    this.props.setMode(mode);
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
    const { jsonEditorOpen, scriptEditorOpen, buildManagerOpen } = this.state;

    return (
      <div className={styles.builder}>
        <TutorialWalkthrough
          ref={(ref) => { this.tutorialRef = ref; }}
          mode={mode}
          onSetMode={this._handleChangeMode}
          onOpenScriptEditor={this._toggleScriptEditor}
          onCloseScriptEditor={this._toggleScriptEditor}
          onReset={this._handleResetAfterTutorial}
        />
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
        {buildManagerOpen && (
          <BuildManager
            mode="popup"
            scriptText={this.state.scriptText}
            bricks={bricks}
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
