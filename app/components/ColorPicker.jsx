import React from 'react';
import { createPortal } from 'react-dom';
import { ChromePicker } from 'react-color';

import { SimpleBrick } from './Icons';
import { colors } from 'utils/constants';

import styles from 'styles/components/color-picker';


class ColorPicker extends React.Component {
  state = {
    open: false,
  }

  constructor(props) {
    super(props);
    this._handleChangeColor = this._handleChangeColor.bind(this);
    this._togglePicker = this._togglePicker.bind(this);
    this._handleClickOutside = this._handleClickOutside.bind(this);
  }

  componentDidMount() {
    const { background } = this.props;
    document.addEventListener('mousedown', this._handleClickOutside);
    this.setState({
      background,
    });
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this._handleClickOutside);
  }

  _handleChangeColor(color) {
    const { handleSetColor } = this.props;
    handleSetColor(color.rgb);
    this.setState({ background: color.rgb });
  }

  _handleClickOutside(event) {
    const { background } = this.props;
    if (this.modal && !this.modal.contains(event.target)) {
      this.setState({
        open: false,
        background,
      });
    }
  }

  _togglePicker() {
    const { background } = this.props;
    this.setState({
      open: !this.state.open,
      background,
    });
  }

  render() {
    const { background, open } = this.state;
    return (
      <React.Fragment>
        <div className={styles.colorPicker}>
          <div className={styles.brick} onClick={this._togglePicker}>
            <SimpleBrick color={background} />
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
                <div className={styles.modalTitle}>Choose Color</div>
                <div className={styles.pickerWrapper}>
                  <ChromePicker
                    color={background}
                    disableAlpha={false}
                    onChangeComplete={this._handleChangeColor}
                    onChange={(color) => this.setState({ background: color.rgb })}
                    presetColors={colors}
                  />
                </div>
              </div>
            </div>
          </React.Fragment>,
          document.body
        )}
      </React.Fragment>
    );
  }
}


export default ColorPicker;
