import React from 'react';
import { createPortal } from 'react-dom';
import isEqual from 'lodash/isEqual';

import { displayNameFromDimensions, getBrickIconFromDimensions } from 'utils';
import { bricks, shapeTypes } from 'utils/constants';

import styles from 'styles/components/brick-picker';


class BrickPicker extends React.Component {
  state = {
    open: false,
    customWidth: 2,
    customLength: 2,
    selectedType: 'rectangle',
  }

  constructor(props) {
    super(props);
    this._togglePicker = this._togglePicker.bind(this);
    this._handleClickOutside = this._handleClickOutside.bind(this);
    this._handleCustomSize = this._handleCustomSize.bind(this);
    this._handleWidthChange = this._handleWidthChange.bind(this);
    this._handleLengthChange = this._handleLengthChange.bind(this);
    this._handleShapeTypeChange = this._handleShapeTypeChange.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this._handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this._handleClickOutside);
  }

  render() {
    const { selectedSize, handleSetBrick } = this.props;
    const { open } = this.state;
    return (
      <React.Fragment>
        <div className={styles.brickPicker}>
          <div className={styles.brick} onClick={this._togglePicker}>
            <div className={styles.brickIcon}>
              {getBrickIconFromDimensions(selectedSize)}
            </div>
            {/* {displayNameFromDimensions(selectedSize)} */}
          </div>
        </div>
        {createPortal(
          <React.Fragment>
            <div className={open ? styles.backdrop : styles.closedBackdrop} onClick={this._togglePicker} />
            <div className={open ? styles.modalWrapper : styles.closedModal}>
              <div className={styles.modal} ref={(modal) => this.modal = modal}>
                <div className={styles.close} onClick={this._togglePicker}>
                  <i className="ion-close" />
                </div>
                <div className={styles.modalTitle}>Choose Brick Size</div>

                <div className={styles.customSizeSection}>
                  <div className={styles.sectionTitle}>Custom Size</div>
                  <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                      <label>Width (W):</label>
                      <input
                        type="number"
                        min="1"
                        max="16"
                        value={this.state.customWidth}
                        onChange={this._handleWidthChange}
                        className={styles.sizeInput}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Length (L):</label>
                      <input
                        type="number"
                        min="1"
                        max="16"
                        value={this.state.customLength}
                        onChange={this._handleLengthChange}
                        className={styles.sizeInput}
                      />
                    </div>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Shape Type:</label>
                    <select
                      value={this.state.selectedType}
                      onChange={this._handleShapeTypeChange}
                      className={styles.shapeSelect}
                    >
                      <option value={shapeTypes.RECTANGLE}>Rectangle</option>
                      <option value={shapeTypes.SLOPE_45}>Slope 45°</option>
                      <option value={shapeTypes.SLOPE_33}>Slope 33°</option>
                      <option value={shapeTypes.SLOPE_INVERTED}>Slope Inverted</option>
                      <option value={shapeTypes.CORNER_INSIDE}>Corner Inside</option>
                      <option value={shapeTypes.CORNER_OUTSIDE}>Corner Outside</option>
                      <option value={shapeTypes.CORNER_ROUND}>Corner Round</option>
                      <option value={shapeTypes.CURVE}>Curve</option>
                      <option value={shapeTypes.ARCH}>Arch</option>
                      <option value={shapeTypes.CYLINDER}>Cylinder</option>
                      <option value={shapeTypes.CONE}>Cone</option>
                      <option value={shapeTypes.WEDGE}>Wedge</option>
                      <option value={shapeTypes.PLATE}>Plate</option>
                      <option value={shapeTypes.TILE}>Tile</option>
                    </select>
                  </div>
                  <button onClick={this._handleCustomSize} className={styles.applyButton}>
                    Apply Custom Size
                  </button>
                </div>

                <div className={styles.presetsSection}>
                  <div className={styles.sectionTitle}>Quick Presets</div>
                  <div className={styles.presetGrid}>
                    {bricks.map((b, i) => (
                      <div
                        key={i}
                        className={isEqual(selectedSize, b) ? styles.presetSelected : styles.presetButton}
                        onClick={() => {
                          handleSetBrick({ ...b, type: 'rectangle' });
                          this.setState({ open: false });
                        }}
                      >
                        <div className={styles.presetIcon}>
                          {getBrickIconFromDimensions(b)}
                        </div>
                        <div className={styles.presetLabel}>
                          {displayNameFromDimensions(b)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>,
          document.body
        )}
      </React.Fragment>
    );
  }

  _togglePicker() {
    this.setState({
      open: !this.state.open,
    });
  }

  _handleClickOutside(event) {
    if (this.modal && !this.modal.contains(event.target)) {
      this.setState({
        open: false,
      });
    }
  }

  _handleWidthChange(e) {
    const value = Math.max(1, Math.min(16, parseInt(e.target.value) || 1));
    this.setState({ customWidth: value });
  }

  _handleLengthChange(e) {
    const value = Math.max(1, Math.min(16, parseInt(e.target.value) || 1));
    this.setState({ customLength: value });
  }

  _handleCustomSize() {
    const { customWidth, customLength, selectedType } = this.state;
    const { handleSetBrick } = this.props;
    handleSetBrick({ x: customWidth, z: customLength, type: selectedType });
    this.setState({ open: false });
  }

  _handleShapeTypeChange(e) {
    this.setState({ selectedType: e.target.value });
  }
}


export default BrickPicker;
