import React from 'react';
import styles from 'styles/components/camera-controls';


class CameraControls extends React.Component {
  state = {
    x: 0,
    y: 0,
    z: 0,
  }

  componentDidMount() {
    this._updatePosition();
    // Update position periodically to reflect changes from other controls
    this.interval = setInterval(() => {
      this._updatePosition();
    }, 100);
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  _updatePosition = () => {
    const { getCameraPosition } = this.props;
    if (getCameraPosition) {
      const pos = getCameraPosition();
      this.setState({
        x: Math.round(pos.x),
        y: Math.round(pos.y),
        z: Math.round(pos.z),
      });
    }
  }

  _handleChange = (axis, value) => {
    const numValue = parseFloat(value) || 0;
    this.setState({ [axis]: numValue });
  }

  _handleApply = () => {
    const { setCameraPosition } = this.props;
    const { x, y, z } = this.state;
    if (setCameraPosition) {
      setCameraPosition(x, y, z);
    }
  }

  _handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this._handleApply();
    }
  }

  render() {
    const { x, y, z } = this.state;

    return (
      <div className={styles.container}>
        <div className={styles.title}>Camera Position</div>
        <div className={styles.inputs}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>X</label>
            <input
              className={styles.input}
              type="number"
              value={x}
              onChange={(e) => this._handleChange('x', e.target.value)}
              onKeyPress={this._handleKeyPress}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Y</label>
            <input
              className={styles.input}
              type="number"
              value={y}
              onChange={(e) => this._handleChange('y', e.target.value)}
              onKeyPress={this._handleKeyPress}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Z</label>
            <input
              className={styles.input}
              type="number"
              value={z}
              onChange={(e) => this._handleChange('z', e.target.value)}
              onKeyPress={this._handleKeyPress}
            />
          </div>
          <button className={styles.applyButton} onClick={this._handleApply}>
            Apply
          </button>
        </div>
      </div>
    );
  }
}


export default CameraControls;
