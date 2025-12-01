import React from 'react';
import { createPortal } from 'react-dom';
import isEqual from 'lodash/isEqual';

import { displayNameFromDimensions, getBrickIconFromDimensions } from 'utils';
import { bricks } from 'utils/constants';

import styles from 'styles/components/brick-picker';


class BrickPicker extends React.Component {
  state = {
    open: false,
  }

  constructor(props) {
    super(props);
    this._togglePicker = this._togglePicker.bind(this);
    this._handleClickOutside = this._handleClickOutside.bind(this);
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
                <div className={styles.brickGrid}>
                  {bricks.map((b, i) => (
                    <div key={i} className={styles.brickExample}>
                      <div className={isEqual(selectedSize, b) ? styles.selected : styles.brickThumb} onClick={() => handleSetBrick(b)}>
                        {getBrickIconFromDimensions(b)}
                      </div>
                      <div className={styles.label}>
                        {displayNameFromDimensions(b)}
                      </div>
                    </div>
                  ))}
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
}


export default BrickPicker;
