import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import {
  getMode,
  getColor,
  getIsGridVisible,
  getBrickDimensions,
  getBricks,
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
    // Don't auto-load on mount - user can manually load [Autosave] from Builds
    // The autosave will still save automatically as you work
  }

  // Autosave temporarily disabled - was causing scene loading issues
  // TODO: Re-implement autosave with proper scene state management

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
        this.props.setScene(objects);
      } catch (err) {
        console.error('Failed to load JSON:', err);
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
      setScene
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
          updateObject={updateBrick} />
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
            jsonText={JSON.stringify(bricks, null, 2)}
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
};


export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Builder);
