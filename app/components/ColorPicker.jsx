import React from 'react';
import { createPortal } from 'react-dom';
import { ChromePicker } from 'react-color';

import { colors } from 'utils/constants';

import styles from 'styles/components/color-picker';


class ColorPicker extends React.Component {
  state = {
    open: false,
    showHelp: false,
  }

  constructor(props) {
    super(props);
    this._handleChangeColor = this._handleChangeColor.bind(this);
    this._togglePicker = this._togglePicker.bind(this);
    this._handleClickOutside = this._handleClickOutside.bind(this);
    this._toggleHelp = this._toggleHelp.bind(this);
  }

  componentDidMount() {
    const { background } = this.props;
    document.addEventListener('mousedown', this._handleClickOutside);

    // Load recently picked colors from localStorage
    const savedColors = this._loadRecentColors();

    this.setState({
      background,
      recentColors: savedColors,
    });
  }

  _loadRecentColors() {
    try {
      const saved = localStorage.getItem('recentColors');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  _saveRecentColor(color) {
    try {
      const rgbaString = `rgba(${color.r},${color.g},${color.b},${color.a !== undefined ? color.a : 1})`;
      let recent = this._loadRecentColors();

      // Remove if already exists
      recent = recent.filter(c => c !== rgbaString);

      // Add to beginning
      recent.unshift(rgbaString);

      // Keep only last 10 colors
      recent = recent.slice(0, 10);

      localStorage.setItem('recentColors', JSON.stringify(recent));
      this.setState({ recentColors: recent });
    } catch (e) {
      // localStorage might be disabled
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this._handleClickOutside);
  }

  _handleChangeColor(color) {
    const { handleSetColor } = this.props;
    handleSetColor(color.rgb);
    this.setState({ background: color.rgb });
    this._saveRecentColor(color.rgb);
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
      showHelp: false,
    });
  }

  _toggleHelp() {
    this.setState({ showHelp: !this.state.showHelp });
  }

  _rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  _rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }

  render() {
    const { background, open, showHelp, recentColors = [] } = this.state;

    // Create inline style for background color
    const bgStyle = background ? {
      backgroundColor: `rgba(${background.r || 0}, ${background.g || 0}, ${background.b || 0}, ${background.a !== undefined ? background.a : 1})`
    } : { backgroundColor: '#ccc' };

    return (
      <React.Fragment>
        <div className={styles.colorPicker}>
          <div className={styles.colorSquare} onClick={this._togglePicker} style={bgStyle} />
        </div>
        {createPortal(
          <React.Fragment>
            <div className={open ? styles.backdrop : styles.closedBackdrop} onClick={this._togglePicker} />
            <div className={open ? styles.modalWrapper : styles.closedModal}>
              <div className={styles.modal} ref={(modal) => this.modal = modal}>
                <div className={styles.close} onClick={this._togglePicker}>
                  <i className="ion-close" />
                </div>
                <div className={styles.modalTitle}>
                  Choose Color
                  <button className={styles.helpButton} onClick={this._toggleHelp}>
                    <i className={showHelp ? "ion-close-circled" : "ion-help-circled"} />
                    {showHelp ? ' Hide' : ' Help'}
                  </button>
                </div>
                <div className={styles.instructionText}>
                  Click on the color square or use the sliders to choose a color
                </div>
                <div className={styles.pickerWrapper}>
                  <ChromePicker
                    color={background}
                    disableAlpha={false}
                    onChangeComplete={this._handleChangeColor}
                    onChange={(color) => this.setState({ background: color.rgb })}
                    presetColors={colors}
                    width="100%"
                    styles={{
                      default: {
                        picker: {
                          width: '100%',
                          boxShadow: 'none',
                        },
                      },
                    }}
                  />
                </div>
                {recentColors.length > 0 && (
                  <div className={styles.recentColors}>
                    <div className={styles.recentTitle}>Recently Used</div>
                    <div className={styles.recentSwatches}>
                      {recentColors.map((colorString, i) => (
                        <div
                          key={i}
                          className={styles.recentSwatch}
                          style={{ backgroundColor: colorString }}
                          onClick={() => {
                            const rgba = colorString.match(/rgba?\((\d+),(\d+),(\d+),?([0-9.]+)?\)/);
                            if (rgba) {
                              const color = {
                                r: parseInt(rgba[1]),
                                g: parseInt(rgba[2]),
                                b: parseInt(rgba[3]),
                                a: rgba[4] ? parseFloat(rgba[4]) : 1
                              };
                              this._handleChangeColor({ rgb: color });
                            }
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {background && showHelp && (
                  <div className={styles.helpText}>
                    <div className={styles.helpTitle}>🎨 Color Formats Explained</div>

                    <div className={styles.formatSection}>
                      <strong>RGBA (Red Green Blue Alpha)</strong>
                      <div className={styles.codeExample}>
                        rgba({background.r || 0}, {background.g || 0}, {background.b || 0}, {(background.a !== undefined ? background.a : 1).toFixed(2)})
                      </div>
                      <p>Each color channel ranges from 0-255. Alpha is 0 (transparent) to 1 (opaque).</p>
                    </div>

                    <div className={styles.formatSection}>
                      <strong>Hex (Hexadecimal)</strong>
                      <div className={styles.codeExample}>
                        {this._rgbToHex(background.r || 0, background.g || 0, background.b || 0)}
                      </div>
                      <p>Six-digit code using 0-9 and A-F. First two digits = red, middle two = green, last two = blue.</p>
                    </div>

                    <div className={styles.formatSection}>
                      <strong>HSLA (Hue Saturation Lightness Alpha)</strong>
                      <div className={styles.codeExample}>
                        hsla({this._rgbToHsl(background.r || 0, background.g || 0, background.b || 0).h}°, {this._rgbToHsl(background.r || 0, background.g || 0, background.b || 0).s}%, {this._rgbToHsl(background.r || 0, background.g || 0, background.b || 0).l}%, {(background.a !== undefined ? background.a : 1).toFixed(2)})
                      </div>
                      <p>H = color type (0-360°), S = color intensity (0-100%), L = brightness (0-100%), A = transparency (0-1).</p>
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
}


export default ColorPicker;
