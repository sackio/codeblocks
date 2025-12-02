import React from 'react';

import Button from 'components/Button';
import ColorPicker from 'components/ColorPicker';
import BrickPicker from 'components/BrickPicker';

import styles from 'styles/components/topbar';


const Topbar = ({
  mode,
  onClickSetMode,
  color,
  onClickSetColor,
  grid,
  onClickToggleGrid,
  brickSize,
  onClickSetBrick,
  onClickReset,
  onClickToggleJSON,
  jsonEditorOpen,
  onClickToggleScript,
  scriptEditorOpen,
  onClickToggleInstructions,
  onClickStartTutorial
}) => {
  return (
    <div className={styles.topbar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <i className="ion-cube" />
        </div>
        <div className={styles.logoText}>CodeBlocks</div>
      </div>
      <div className={styles.section}>
        <Button
          active={mode === 'build'}
          onClick={() => onClickSetMode('build')}
          icon="hammer"
          text="Build" />
        <Button
          active={mode === 'paint'}
          onClick={() => onClickSetMode('paint')}
          icon="paintbrush"
          text="Paint" />
      </div>
      <div className={styles.section}>
        <div className={styles.title}>
          Color
        </div>
        <ColorPicker background={color} handleSetColor={onClickSetColor} />
      </div>
      <div className={styles.section}>
        <div className={styles.title}>
          Brick
        </div>
        <BrickPicker selectedSize={brickSize} handleSetBrick={onClickSetBrick} />
      </div>
      <div className={styles.rightSection}>
        <Button
          onClick={onClickStartTutorial}
          icon="information-circled"
          text="Tutorial" />
        <Button
          onClick={onClickToggleInstructions}
          icon="help-circled"
          text="Help" />
        <Button
          active={scriptEditorOpen}
          onClick={onClickToggleScript}
          icon="play"
          text="Script" />
        <Button
          active={jsonEditorOpen}
          onClick={onClickToggleJSON}
          icon="code"
          text="JSON" />
        <Button
          onClick={onClickReset}
          icon="trash-a"
          text="Reset" />
      </div>
    </div>
  );
}


export default Topbar;
