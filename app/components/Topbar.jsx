import React from 'react';

import Button from 'components/Button';
import ColorPicker from 'components/ColorPicker';
import BrickPicker from 'components/BrickPicker';

import styles from 'styles/components/topbar';


class Topbar extends React.Component {
  state = {
    mobileMenuOpen: false,
  }

  constructor(props) {
    super(props);
    this._toggleMobileMenu = this._toggleMobileMenu.bind(this);
    this._closeMobileMenu = this._closeMobileMenu.bind(this);
  }

  _toggleMobileMenu() {
    this.setState({ mobileMenuOpen: !this.state.mobileMenuOpen });
  }

  _closeMobileMenu() {
    this.setState({ mobileMenuOpen: false });
  }

  render() {
    const {
      mode,
      onClickSetMode,
      color,
      onClickSetColor,
      brickSize,
      onClickSetBrick,
      onClickReset,
      onClickToggleJSON,
      jsonEditorOpen,
      onClickToggleScript,
      scriptEditorOpen,
      onClickToggleInstructions,
      onClickStartTutorial,
      onClickToggleBuildManager,
      buildManagerOpen,
      onClickUndo,
      onClickRedo,
      canUndo,
      canRedo
    } = this.props;

    const { mobileMenuOpen } = this.state;

    return (
      <div className={styles.topbar}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <i className="ion-cube" />
          </div>
          <div className={styles.logoText}>CodeBlocks</div>
        </div>

        {/* Hamburger button for mobile */}
        <div className={styles.hamburger} onClick={this._toggleMobileMenu}>
          <i className={mobileMenuOpen ? "ion-close" : "ion-navicon-round"} />
        </div>

        {/* Main sections - hidden on mobile unless menu is open */}
        <div className={mobileMenuOpen ? styles.sectionsOpen : styles.sections}>
          <div className={styles.section}>
            <Button
              active={mode === 'build'}
              onClick={() => { onClickSetMode('build'); this._closeMobileMenu(); }}
              icon="hammer"
              text="Build"
              dataMode="build" />
            <Button
              active={mode === 'edit'}
              onClick={() => { onClickSetMode('edit'); this._closeMobileMenu(); }}
              icon="edit"
              text="Edit"
              dataMode="edit" />
            <Button
              active={mode === 'paint'}
              onClick={() => { onClickSetMode('paint'); this._closeMobileMenu(); }}
              icon="paintbrush"
              text="Paint"
              dataMode="paint" />
          </div>
          <div className={styles.section}>
            <ColorPicker background={color} handleSetColor={onClickSetColor} />
          </div>
          <div className={styles.section}>
            <BrickPicker selectedSize={brickSize} handleSetBrick={onClickSetBrick} color={color} />
          </div>
          <div className={styles.rightSection}>
            <Button
              onClick={() => { onClickUndo(); this._closeMobileMenu(); }}
              icon="arrow-return-left"
              text="Undo"
              disabled={!canUndo} />
            <Button
              onClick={() => { onClickRedo(); this._closeMobileMenu(); }}
              icon="arrow-return-right"
              text="Redo"
              disabled={!canRedo} />
            <Button
              onClick={() => { onClickStartTutorial(); this._closeMobileMenu(); }}
              icon="information-circled"
              text="Tutorial" />
            <Button
              onClick={() => { onClickStartTutorial(); this._closeMobileMenu(); }}
              icon="help-circled"
              text="Help" />
            <Button
              active={scriptEditorOpen}
              onClick={() => { onClickToggleScript(); this._closeMobileMenu(); }}
              icon="play"
              text="Script" />
            <Button
              active={jsonEditorOpen}
              onClick={() => { onClickToggleJSON(); this._closeMobileMenu(); }}
              icon="code"
              text="JSON" />
            <Button
              active={buildManagerOpen}
              onClick={() => { onClickToggleBuildManager(); this._closeMobileMenu(); }}
              icon="folder"
              text="Builds" />
            <Button
              onClick={() => { onClickReset(); this._closeMobileMenu(); }}
              icon="trash-a"
              text="Reset" />
          </div>
        </div>
      </div>
    );
  }
}


export default Topbar;
