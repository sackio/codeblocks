import React from 'react';
import { createPortal } from 'react-dom';

import { displayNameFromDimensions, getBrickIconFromDimensions } from 'utils';
import { shapeTypes } from 'utils/constants';

import styles from 'styles/components/brick-picker';


class BrickPicker extends React.Component {
  state = {
    open: false,
    customWidth: 2,
    customHeight: '', // Empty means use default height calculation
    customLength: 2,
    selectedType: 'rectangle',
    recentBricks: [],
  }

  constructor(props) {
    super(props);
    this._togglePicker = this._togglePicker.bind(this);
    this._handleClickOutside = this._handleClickOutside.bind(this);
    this._handleCustomSize = this._handleCustomSize.bind(this);
    this._handleWidthChange = this._handleWidthChange.bind(this);
    this._handleHeightChange = this._handleHeightChange.bind(this);
    this._handleLengthChange = this._handleLengthChange.bind(this);
    this._handleShapeTypeChange = this._handleShapeTypeChange.bind(this);
    this._addToRecent = this._addToRecent.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this._handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this._handleClickOutside);
  }

  _addToRecent(brick) {
    // Runtime-only recent bricks (not persisted)
    const { recentBricks } = this.state;

    // Check if this exact brick already exists
    const exists = recentBricks.some(b =>
      b.x === brick.x &&
      (b.y || undefined) === (brick.y || undefined) &&
      b.z === brick.z &&
      b.type === brick.type
    );

    if (exists) return;

    // Add to beginning, limit to 8 recent items
    const updated = [brick, ...recentBricks].slice(0, 8);

    this.setState({ recentBricks: updated });
  }

  render() {
    const { selectedSize, handleSetBrick, color } = this.props;
    const { open } = this.state;

    // Create inline style for the brick icon color
    const iconStyle = color ? {
      color: `rgba(${color.r || 0}, ${color.g || 0}, ${color.b || 0}, ${color.a !== undefined ? color.a : 1})`
    } : {};

    return (
      <React.Fragment>
        <div className={styles.brickPicker}>
          <div className={styles.brick} onClick={this._togglePicker}>
            <div className={styles.brickIcon} style={iconStyle}>
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
                      <label>Height (H):</label>
                      <input
                        type="number"
                        min="1"
                        max="16"
                        value={this.state.customHeight}
                        onChange={this._handleHeightChange}
                        placeholder="Auto"
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
                      <option value={shapeTypes.CYLINDER}>Cylinder</option>
                      <option value={shapeTypes.CONE}>Cone</option>
                      <option value={shapeTypes.WEDGE}>Wedge</option>
                      <option value={shapeTypes.PLATE}>Plate</option>
                      <option value={shapeTypes.TILE}>Tile</option>
                    </select>
                  </div>
                  <div className={styles.previewSection} key={`${this.state.customWidth}-${this.state.customHeight}-${this.state.customLength}-${this.state.selectedType}`}>
                    <div className={styles.previewTitle}>Preview</div>
                    <div className={styles.previewBrick}>
                      {(() => {
                        const previewDims = { x: this.state.customWidth, z: this.state.customLength, type: this.state.selectedType };
                        if (this.state.customHeight !== '' && this.state.customHeight > 0) {
                          previewDims.y = this.state.customHeight;
                        }
                        return getBrickIconFromDimensions(previewDims);
                      })()}
                    </div>
                    <div className={styles.previewLabel}>
                      {this.state.customWidth}W × {this.state.customHeight || 'Auto'}H × {this.state.customLength}L - {this.state.selectedType}
                    </div>
                  </div>
                  <button onClick={this._handleCustomSize} className={styles.applyButton}>
                    Apply Custom Size
                  </button>
                </div>

                {this.state.recentBricks.length > 0 && (
                  <div className={styles.recentSection}>
                    <div className={styles.sectionTitle}>Recent Selections</div>
                    <div className={styles.recentGrid}>
                      {this.state.recentBricks.map((brick, i) => (
                        <div
                          key={i}
                          className={styles.recentButton}
                          onClick={() => {
                            handleSetBrick(brick);
                            this.setState({ open: false });
                          }}
                        >
                          <div className={styles.recentIcon}>
                            {getBrickIconFromDimensions(brick)}
                          </div>
                          <div className={styles.recentLabel}>
                            {displayNameFromDimensions(brick)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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

  _handleHeightChange(e) {
    const inputValue = e.target.value;
    // Allow empty string for "Auto" mode
    if (inputValue === '') {
      this.setState({ customHeight: '' });
    } else {
      const value = Math.max(1, Math.min(16, parseInt(inputValue) || 1));
      this.setState({ customHeight: value });
    }
  }

  _handleLengthChange(e) {
    const value = Math.max(1, Math.min(16, parseInt(e.target.value) || 1));
    this.setState({ customLength: value });
  }

  _handleCustomSize() {
    const { customWidth, customHeight, customLength, selectedType } = this.state;
    const { handleSetBrick } = this.props;
    const brick = { x: customWidth, z: customLength, type: selectedType };
    // Only include y (height) if it's been explicitly set
    if (customHeight !== '' && customHeight > 0) {
      brick.y = customHeight;
    }
    handleSetBrick(brick);
    this._addToRecent(brick);
    this.setState({ open: false });
  }

  _handleShapeTypeChange(e) {
    this.setState({ selectedType: e.target.value });
  }
}


export default BrickPicker;
