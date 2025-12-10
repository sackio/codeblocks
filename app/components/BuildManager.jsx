import React from 'react';
import styles from 'styles/components/build-manager';
import {
  getAllBuilds,
  saveBuild,
  deleteBuild,
  handleStorageError,
  initStorage,
} from 'utils/storage';

class BuildManager extends React.Component {
  state = {
    builds: [],
    showSaveDialog: false,
    buildName: '',
    saveError: null,
  }

  componentDidMount() {
    // Initialize storage on mount
    initStorage();
    this._loadBuilds();
  }

  _loadBuilds = () => {
    try {
      const builds = getAllBuilds();
      this.setState({ builds });
    } catch (err) {
      console.error('Failed to load builds:', err);
      handleStorageError(err);
      this.setState({ builds: [] });
    }
  }

  _handleSave = () => {
    const { buildName } = this.state;
    const { scriptText, bricks } = this.props;

    if (!buildName.trim()) {
      this.setState({ saveError: 'Please enter a build name' });
      return;
    }

    try {
      // Save build using storage utility
      // Note: bricks should be passed from Builder, not jsonText
      const savedBuild = saveBuild(buildName.trim(), scriptText || '', bricks || []);

      // Reload builds list
      this._loadBuilds();

      this.setState({
        showSaveDialog: false,
        buildName: '',
        saveError: null
      });

      // Show success message
      if (this.props.onSaveSuccess) {
        this.props.onSaveSuccess(buildName.trim());
      }
    } catch (err) {
      console.error('Failed to save build:', err);
      this.setState({ saveError: err.message || 'Failed to save build' });
    }
  }

  _handleLoad = (build) => {
    const { onLoadBuild } = this.props;
    if (onLoadBuild) {
      onLoadBuild(build);
    }
  }

  _handleDelete = (buildId, buildName) => {
    if (!confirm(`Delete build "${buildName}"?`)) {
      return;
    }

    try {
      const deleted = deleteBuild(buildId);

      if (deleted) {
        // Reload builds list
        this._loadBuilds();
      } else {
        alert('Build not found');
      }
    } catch (err) {
      console.error('Failed to delete build:', err);
      handleStorageError(err);
    }
  }

  _openSaveDialog = () => {
    this.setState({ showSaveDialog: true, saveError: null });
  }

  _closeSaveDialog = () => {
    this.setState({ showSaveDialog: false, buildName: '', saveError: null });
  }

  _handleNameChange = (e) => {
    this.setState({ buildName: e.target.value, saveError: null });
  }

  _handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this._handleSave();
    } else if (e.key === 'Escape') {
      this._closeSaveDialog();
    }
  }

  _formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  render() {
    const { builds, showSaveDialog, buildName, saveError } = this.state;
    const { mode } = this.props; // 'inline' or 'popup'

    if (mode === 'inline') {
      // Inline mode for toolbar buttons
      return (
        <React.Fragment>
          <button
            className={styles.toolbarButton}
            onClick={this._openSaveDialog}
            title="Save current build">
            <i className="ion-ios-download-outline" /> Save
          </button>

          {showSaveDialog && (
            <div className={styles.overlay} onClick={this._closeSaveDialog}>
              <div className={styles.saveDialog} onClick={(e) => e.stopPropagation()}>
                <div className={styles.dialogHeader}>
                  <h3>Save Build</h3>
                  <button className={styles.closeButton} onClick={this._closeSaveDialog}>
                    <i className="ion-close" />
                  </button>
                </div>

                {saveError && (
                  <div className={styles.error}>
                    <i className="ion-alert-circled" /> {saveError}
                  </div>
                )}

                <input
                  type="text"
                  className={styles.nameInput}
                  value={buildName}
                  onChange={this._handleNameChange}
                  onKeyDown={this._handleKeyPress}
                  placeholder="Enter build name..."
                  autoFocus
                />

                <div className={styles.dialogActions}>
                  <button className={styles.cancelButton} onClick={this._closeSaveDialog}>
                    Cancel
                  </button>
                  <button
                    className={styles.saveButton}
                    onClick={this._handleSave}
                    disabled={!buildName.trim()}>
                    Save
                  </button>
                </div>

                {builds.length > 0 && (
                  <div className={styles.existingBuilds}>
                    <p className={styles.hint}>
                      <i className="ion-information-circled" /> Tip: Enter an existing name to overwrite
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </React.Fragment>
      );
    }

    // Popup mode for full build manager
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>
            <i className="ion-folder" /> Saved Builds
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              className={styles.saveHeaderButton}
              onClick={this._openSaveDialog}
              title="Save current build">
              <i className="ion-ios-download-outline" /> Save Build
            </button>
            <button className={styles.closeButton} onClick={this.props.onClose}>
              <i className="ion-close" />
            </button>
          </div>
        </div>

        {showSaveDialog && (
          <div className={styles.overlay} onClick={this._closeSaveDialog}>
            <div className={styles.saveDialog} onClick={(e) => e.stopPropagation()}>
              <div className={styles.dialogHeader}>
                <h3>Save Build</h3>
                <button className={styles.closeButton} onClick={this._closeSaveDialog}>
                  <i className="ion-close" />
                </button>
              </div>

              {saveError && (
                <div className={styles.error}>
                  <i className="ion-alert-circled" /> {saveError}
                </div>
              )}

              <input
                type="text"
                className={styles.nameInput}
                value={buildName}
                onChange={this._handleNameChange}
                onKeyDown={this._handleKeyPress}
                placeholder="Enter build name..."
                autoFocus
              />

              <div className={styles.dialogActions}>
                <button className={styles.cancelButton} onClick={this._closeSaveDialog}>
                  Cancel
                </button>
                <button
                  className={styles.saveButton}
                  onClick={this._handleSave}
                  disabled={!buildName.trim()}>
                  Save
                </button>
              </div>

              {builds.length > 0 && (
                <div className={styles.existingBuilds}>
                  <p className={styles.hint}>
                    <i className="ion-information-circled" /> Tip: Enter an existing name to overwrite
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {builds.length === 0 ? (
          <div className={styles.emptyState}>
            <i className="ion-ios-box-outline" />
            <p>No saved builds yet</p>
            <p className={styles.hint}>Click &quot;Save Build&quot; above to save your current build</p>
          </div>
        ) : (
          <div className={styles.buildList}>
            {builds.map((build) => (
              <div key={build.id} className={styles.buildItem}>
                <div className={styles.buildInfo}>
                  <div className={styles.buildName}>{build.name}</div>
                  <div className={styles.buildDate}>{this._formatDate(build.timestamp)}</div>
                  <div className={styles.buildStats}>
                    {build.script && <span><i className="ion-code" /> Script</span>}
                    {build.json && <span><i className="ion-document-text" /> JSON</span>}
                    {build.metadata && build.metadata.brickCount > 0 && (
                      <span><i className="ion-cube" /> {build.metadata.brickCount} bricks</span>
                    )}
                  </div>
                </div>
                <div className={styles.buildActions}>
                  <button
                    className={styles.loadButton}
                    onClick={() => this._handleLoad(build)}
                    title="Load this build">
                    <i className="ion-ios-upload-outline" /> Load
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => this._handleDelete(build.id, build.name)}
                    title="Delete this build">
                    <i className="ion-trash-a" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default BuildManager;
