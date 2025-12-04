import React from 'react';
import Brick from 'components/engine/Brick';
import AIHelper from 'components/AIHelper';

import styles from 'styles/components/json-editor';


class JSONEditor extends React.Component {
  state = {
    jsonText: '',
    error: null,
    syntaxWarning: null,
    aiHelperOpen: false,
  }

  componentDidMount() {
    this._updateJSONFromObjects();
  }

  componentDidUpdate(prevProps) {
    // Update JSON when objects change externally (from 3D scene)
    if (prevProps.objects !== this.props.objects && !this.state.editing) {
      this._updateJSONFromObjects();
    }
  }

  _updateJSONFromObjects() {
    const { objects } = this.props;
    const serialized = this._serializeObjects(objects);
    this.setState({
      jsonText: JSON.stringify(serialized, null, 2),
      error: null,
      syntaxWarning: null,
    });
  }

  _serializeObjects(objects) {
    return objects.map(obj => ({
      id: obj.customId,
      position: {
        x: obj.position.x,
        y: obj.position.y,
        z: obj.position.z,
      },
      rotation: obj.rotation.y,
      color: obj._color,
      dimensions: obj._dimensions,
      translation: obj._translation,
    }));
  }

  _handleJSONChange = (e) => {
    const newText = e.target.value;

    // Validate JSON syntax in real-time
    let syntaxWarning = null;
    if (newText.trim()) {
      try {
        JSON.parse(newText);
      } catch (err) {
        syntaxWarning = `Syntax error: ${err.message}`;
      }
    }

    this.setState({
      jsonText: newText,
      editing: true,
      error: null,
      syntaxWarning,
    });
  }

  _handleApply = () => {
    const { jsonText } = this.state;
    const { loadObjectsFromJSON } = this.props;

    try {
      const parsed = JSON.parse(jsonText);

      // Validate structure
      if (!Array.isArray(parsed)) {
        throw new Error('JSON must be an array of objects');
      }

      // Reconstruct Brick objects
      const reconstructed = parsed.map(data => {
        // Create a fake intersect object for the constructor
        const fakeIntersect = {
          point: new THREE.Vector3(0, 0, 0),
          face: { normal: new THREE.Vector3(0, 1, 0) }
        };

        // Create brick with basic parameters
        const brick = new Brick(
          fakeIntersect,
          data.color,
          data.dimensions,
          data.rotation || 0,
          data.translation || 0
        );

        // Override position with saved position
        brick.position.set(data.position.x, data.position.y, data.position.z);
        brick.rotation.y = data.rotation || 0;

        // Restore ID if present
        if (data.id) {
          brick.customId = data.id;
        }

        return brick;
      });

      loadObjectsFromJSON(reconstructed);
      this.setState({
        editing: false,
        error: null,
        syntaxWarning: null,
      });
    } catch (err) {
      this.setState({ error: err.message });
    }
  }

  _handleExport = () => {
    const { jsonText } = this.state;
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'codeblocks-build.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  _handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      this.setState({
        jsonText: event.target.result,
        editing: true,
      });
    };
    reader.readAsText(file);
  }

  _handleClear = () => {
    const { loadObjectsFromJSON } = this.props;
    loadObjectsFromJSON([]);
    this.setState({
      jsonText: '[]',
      editing: false,
      error: null,
      syntaxWarning: null,
    });
  }

  _toggleAIHelper = () => {
    this.setState({ aiHelperOpen: !this.state.aiHelperOpen });
  }

  _handleAIGenerate = (generatedJSON) => {
    // Validate JSON syntax
    let syntaxWarning = null;
    if (generatedJSON.trim()) {
      try {
        JSON.parse(generatedJSON);
      } catch (err) {
        syntaxWarning = `Syntax error: ${err.message}`;
      }
    }

    this.setState({
      jsonText: generatedJSON,
      editing: true,
      error: null,
      syntaxWarning,
    });
  }

  _handleAIEdit = (editedJSON) => {
    // Validate JSON syntax
    let syntaxWarning = null;
    if (editedJSON.trim()) {
      try {
        JSON.parse(editedJSON);
      } catch (err) {
        syntaxWarning = `Syntax error: ${err.message}`;
      }
    }

    this.setState({
      jsonText: editedJSON,
      editing: true,
      error: null,
      syntaxWarning,
    });
  }

  render() {
    const { jsonText, error, syntaxWarning } = this.state;
    const { onClose, captureScreenshot } = this.props;

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>JSON Editor</div>
          <button className={styles.closeButton} onClick={onClose}>
            <i className="ion-close" />
          </button>
        </div>

        {error && (
          <div className={styles.error}>
            <i className="ion-alert-circled" /> {error}
          </div>
        )}

        {syntaxWarning && !error && (
          <div className={styles.warning}>
            <i className="ion-alert" /> {syntaxWarning}
          </div>
        )}

        <div className={styles.toolbar}>
          <button className={styles.button} onClick={this._handleApply}>
            <i className="ion-checkmark" /> Apply Changes
          </button>
          <button className={styles.button} onClick={this._handleExport}>
            <i className="ion-download" /> Export
          </button>
          <label className={styles.button}>
            <i className="ion-upload" /> Import
            <input
              type="file"
              accept=".json"
              onChange={this._handleImport}
              style={{ display: 'none' }}
            />
          </label>
          <button className={styles.buttonDanger} onClick={this._handleClear}>
            <i className="ion-trash-a" /> Clear All
          </button>
          <button className={styles.button} onClick={this._toggleAIHelper}>
            <i className="ion-wand" /> AI Helper
          </button>
        </div>

        <textarea
          className={styles.textarea}
          value={jsonText}
          onChange={this._handleJSONChange}
          spellCheck={false}
        />

        <AIHelper
          isOpen={this.state.aiHelperOpen}
          onClose={this._toggleAIHelper}
          title="AI JSON Assistant"
          apiEndpoint="/api/chat/json"
          contentKey="currentJSON"
          currentContent={jsonText}
          onGenerate={this._handleAIGenerate}
          onEdit={this._handleAIEdit}
          captureScreenshot={captureScreenshot}
        />
      </div>
    );
  }
}


export default JSONEditor;
