import React from 'react';
import styles from 'styles/components/view-controls';


class ViewControls extends React.Component {
  render() {
    const {
      onTopView,
      onFrontView,
      onSideView,
      onIsometricView,
      onResetView,
      onZoomIn,
      onZoomOut,
    } = this.props;

    return (
      <div className={styles.container}>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Camera Views</div>
          <button className={styles.button} onClick={onTopView} title="Top View">
            <i className="ion-arrow-up-c" /> Top
          </button>
          <button className={styles.button} onClick={onFrontView} title="Front View">
            <i className="ion-eye" /> Front
          </button>
          <button className={styles.button} onClick={onSideView} title="Side View">
            <i className="ion-arrow-right-c" /> Side
          </button>
          <button className={styles.button} onClick={onIsometricView} title="Isometric View">
            <i className="ion-cube" /> Iso
          </button>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Controls</div>
          <button className={styles.button} onClick={onResetView} title="Reset to Default View">
            <i className="ion-home" /> Reset
          </button>
          <button className={styles.button} onClick={onZoomIn} title="Zoom In">
            <i className="ion-plus" /> Zoom+
          </button>
          <button className={styles.button} onClick={onZoomOut} title="Zoom Out">
            <i className="ion-minus" /> Zoom-
          </button>
        </div>
      </div>
    );
  }
}


export default ViewControls;
