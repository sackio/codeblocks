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

import styles from 'styles/containers/builder';


class Builder extends React.Component {
  state = {
    jsonEditorOpen: false,
    scriptEditorOpen: false,
    instructionsOpen: false,
  }

  componentDidMount() {
    this.tutorial = new Tutorial();
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
    const { jsonEditorOpen, scriptEditorOpen, instructionsOpen } = this.state;

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
        />
        <Scene
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
          />
        )}
        {instructionsOpen && (
          <InstructionsModal
            onClose={this._toggleInstructions}
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
