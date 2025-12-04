import React from 'react';
import styles from 'styles/components/build-manager';

class BuildManager extends React.Component {
  state = {
    builds: [],
    showSaveDialog: false,
    buildName: '',
    saveError: null,
  }

  componentDidMount() {
    this._loadBuilds();
  }

  _loadBuilds = () => {
    try {
      const savedBuilds = localStorage.getItem('codeblocks_builds');
      const builds = savedBuilds ? JSON.parse(savedBuilds) : [];
      this.setState({ builds });
    } catch (err) {
      console.error('Failed to load builds:', err);
      this.setState({ builds: [] });
    }
  }

  _saveBuilds = (builds) => {
    try {
      localStorage.setItem('codeblocks_builds', JSON.stringify(builds));
      this.setState({ builds });
    } catch (err) {
      console.error('Failed to save builds:', err);
      this.setState({ saveError: 'Failed to save build. Storage may be full.' });
    }
  }

  _handleSave = () => {
    const { buildName, builds } = this.state;
    const { scriptText, jsonText } = this.props;

    if (!buildName.trim()) {
      this.setState({ saveError: 'Please enter a build name' });
      return;
    }

    // Check if name already exists
    const existingIndex = builds.findIndex(b => b.name === buildName.trim());

    const newBuild = {
      name: buildName.trim(),
      script: scriptText || '',
      json: jsonText || '',
      timestamp: Date.now(),
    };

    let updatedBuilds;
    if (existingIndex >= 0) {
      // Overwrite existing build
      updatedBuilds = [...builds];
      updatedBuilds[existingIndex] = newBuild;
    } else {
      // Add new build
      updatedBuilds = [...builds, newBuild];
    }

    this._saveBuilds(updatedBuilds);
    this.setState({
      showSaveDialog: false,
      buildName: '',
      saveError: null
    });

    // Show success message briefly
    if (this.props.onSaveSuccess) {
      this.props.onSaveSuccess(buildName.trim());
    }
  }

  _handleLoad = (build) => {
    const { onLoadBuild } = this.props;
    if (onLoadBuild) {
      onLoadBuild(build);
    }
  }

  _handleDelete = (buildName) => {
    if (!confirm(`Delete build "${buildName}"?`)) {
      return;
    }

    const { builds } = this.state;
    const updatedBuilds = builds.filter(b => b.name !== buildName);
    this._saveBuilds(updatedBuilds);
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
            {builds.map((build, index) => (
              <div key={index} className={styles.buildItem}>
                <div className={styles.buildInfo}>
                  <div className={styles.buildName}>{build.name}</div>
                  <div className={styles.buildDate}>{this._formatDate(build.timestamp)}</div>
                  <div className={styles.buildStats}>
                    {build.script && <span><i className="ion-code" /> Script</span>}
                    {build.json && <span><i className="ion-document-text" /> JSON</span>}
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
                    onClick={() => this._handleDelete(build.name)}
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
