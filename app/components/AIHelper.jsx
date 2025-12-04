import React from 'react';
import styles from 'styles/components/ai-helper';

class AIHelper extends React.Component {
  state = {
    prompt: '',
    loading: false,
    error: null,
    includeScreenshot: false,
  }

  _handlePromptChange = (e) => {
    this.setState({ prompt: e.target.value, error: null });
  }

  _handleGenerate = async () => {
    const { prompt } = this.state;
    const { onGenerate, apiEndpoint, currentContent } = this.props;

    if (!prompt.trim()) {
      this.setState({ error: 'Please enter instructions' });
      return;
    }

    this.setState({ loading: true, error: null });

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          [this.props.contentKey]: currentContent || '',
          mode: 'generate'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate');
      }

      const generatedContent = data.message.content;

      // Clean up markdown code fences if present
      const cleanedContent = this._cleanCodeFences(generatedContent);

      onGenerate(cleanedContent);
      this.setState({ prompt: '', loading: false });

      // Auto-close AI Helper after successful generation
      this.props.onClose();
    } catch (error) {
      this.setState({
        error: error.message || 'Failed to generate content',
        loading: false
      });
    }
  }

  _handleEdit = async () => {
    const { prompt, includeScreenshot } = this.state;
    const { onEdit, apiEndpoint, currentContent, captureScreenshot } = this.props;

    if (!prompt.trim()) {
      this.setState({ error: 'Please enter edit instructions' });
      return;
    }

    if (!currentContent || !currentContent.trim()) {
      this.setState({ error: 'No content to edit' });
      return;
    }

    this.setState({ loading: true, error: null });

    try {
      // Capture screenshot if requested
      let screenshotData = null;
      if (includeScreenshot && captureScreenshot) {
        screenshotData = captureScreenshot();
      }

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          [this.props.contentKey]: currentContent,
          mode: 'edit',
          screenshot: screenshotData
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to edit');
      }

      const editedContent = data.message.content;

      // Clean up markdown code fences if present
      const cleanedContent = this._cleanCodeFences(editedContent);

      onEdit(cleanedContent);
      this.setState({ prompt: '', loading: false });

      // Auto-close AI Helper after successful edit
      this.props.onClose();
    } catch (error) {
      this.setState({
        error: error.message || 'Failed to edit content',
        loading: false
      });
    }
  }

  _cleanCodeFences = (content) => {
    // Failsafe parsing to extract code from markdown fences
    let cleaned = content.trim();

    // Strategy 1: Try to extract code from fenced code blocks
    // Match ```language\ncode\n``` or ```\ncode\n```
    const fencePattern = /```(?:javascript|json|js)?\s*\n([\s\S]*?)\n```/gi;
    const matches = cleaned.match(fencePattern);

    if (matches && matches.length > 0) {
      // Extract all code blocks and pick the largest one (most likely the actual code)
      const codeBlocks = matches.map(match => {
        return match
          .replace(/^```(?:javascript|json|js)?\s*\n/i, '')
          .replace(/\n```$/,'')
          .trim();
      });

      // Return the longest code block (most likely to be the actual code, not an example)
      cleaned = codeBlocks.reduce((longest, current) =>
        current.length > longest.length ? current : longest
      , '');

      return cleaned;
    }

    // Strategy 2: Handle simple start/end fences without proper closing
    cleaned = cleaned.replace(/^```(?:javascript|json|js)?\s*\n?/i, '');
    cleaned = cleaned.replace(/\n?```\s*$/,'');

    // Strategy 3: Remove any remaining triple backticks
    cleaned = cleaned.replace(/```/g, '');

    // Strategy 4: If response contains explanatory text, try to extract just the code
    // Look for common patterns like "Here's the code:" or "Here is..." followed by code
    const explanationPattern = /(?:here(?:'s| is)|the code|updated code|modified code|new code)[\s:]*\n+([\s\S]+)/i;
    const explanationMatch = cleaned.match(explanationPattern);
    if (explanationMatch && explanationMatch[1]) {
      // Only use this if it looks like code (contains semicolons, braces, etc.)
      const potentialCode = explanationMatch[1].trim();
      if (potentialCode.match(/[{};()]/)) {
        cleaned = potentialCode;
      }
    }

    return cleaned.trim();
  }

  _handleKeyPress = (e) => {
    // Submit on Cmd/Ctrl + Enter
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (this.props.currentContent && this.props.currentContent.trim()) {
        this._handleEdit();
      } else {
        this._handleGenerate();
      }
    }
  }

  _toggleScreenshot = () => {
    this.setState({ includeScreenshot: !this.state.includeScreenshot });
  }

  render() {
    const { prompt, loading, error, includeScreenshot } = this.state;
    const { isOpen, onClose, title, currentContent, captureScreenshot } = this.props;

    if (!isOpen) return null;

    const hasContent = currentContent && currentContent.trim();

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>
            <i className="ion-wand" /> {title || 'AI Assistant'}
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <i className="ion-close" />
          </button>
        </div>

        {error && (
          <div className={styles.error}>
            <i className="ion-alert-circled" /> {error}
          </div>
        )}

        <div className={styles.content}>
          <textarea
            className={styles.textarea}
            value={prompt}
            onChange={this._handlePromptChange}
            onKeyDown={this._handleKeyPress}
            placeholder={hasContent
              ? "Describe how to modify the code... (Cmd/Ctrl + Enter to submit)"
              : "Describe what you want to create... (Cmd/Ctrl + Enter to submit)"
            }
            disabled={loading}
            rows={4}
          />

          {hasContent && captureScreenshot && (
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={includeScreenshot}
                onChange={this._toggleScreenshot}
                disabled={loading}
              />
              <span>Include canvas screenshot for context</span>
            </label>
          )}

          <div className={styles.actions}>
            <button
              className={styles.buttonGenerate}
              onClick={this._handleGenerate}
              disabled={loading || !prompt.trim()}>
              <i className="ion-plus-circled" />
              {loading ? 'Generating...' : 'Generate New'}
            </button>

            {hasContent && (
              <button
                className={styles.buttonEdit}
                onClick={this._handleEdit}
                disabled={loading || !prompt.trim()}>
                <i className="ion-edit" />
                {loading ? 'Editing...' : 'Edit Existing'}
              </button>
            )}
          </div>

          <div className={styles.hint}>
            <i className="ion-information-circled" />
            Generate creates new content, Edit modifies existing content
          </div>
        </div>
      </div>
    );
  }
}

export default AIHelper;
