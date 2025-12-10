/**
 * Centralized localStorage utilities for CodeBlocks
 *
 * Manages all persistent storage operations including:
 * - Build saving/loading/deletion
 * - Brick serialization/deserialization
 * - Error handling for storage operations
 */

const STORAGE_KEY = 'codeblocks_app_data';
const STORAGE_VERSION = 1;

/**
 * Initialize storage structure if it doesn't exist
 * Migrates from old format if necessary
 */
export function initStorage() {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);

    if (!existing) {
      // Initialize fresh storage
      const initialData = {
        version: STORAGE_VERSION,
        builds: [],
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
      return initialData;
    }

    // Validate existing structure
    const data = JSON.parse(existing);

    if (!data.version || !Array.isArray(data.builds)) {
      throw new Error('Invalid storage structure');
    }

    return data;
  } catch (err) {
    console.error('Storage initialization failed:', err);

    // Clear corrupted data and reinitialize
    try {
      localStorage.removeItem(STORAGE_KEY);
      return initStorage();
    } catch (e) {
      throw new Error('localStorage is not available');
    }
  }
}

/**
 * Get the current storage data
 */
function getStorageData() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return initStorage();
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to read storage:', err);
    return initStorage();
  }
}

/**
 * Save storage data
 */
function setStorageData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (err) {
    if (err.name === 'QuotaExceededError') {
      throw new Error('Storage quota exceeded. Try deleting some builds.');
    }
    throw err;
  }
}

/**
 * Serialize bricks from Brick objects to plain JavaScript objects
 * Handles both Brick instances (with private properties) and plain objects
 */
export function serializeBricks(bricks) {
  if (!Array.isArray(bricks)) {
    return [];
  }

  return bricks.map((brick) => {
    // Handle both Brick instances (with private properties starting with _)
    // and plain objects from loaded data
    const color = brick._color || brick.color;
    const dimensions = brick._dimensions || brick.dimensions;
    const translation = brick._translation !== undefined ? brick._translation : brick.translation;
    const intersect = brick._intersect || brick.intersect;

    return {
      customId: brick.customId,
      position: {
        x: brick.position.x,
        y: brick.position.y,
        z: brick.position.z,
      },
      rotation: {
        y: brick.rotation.y,
      },
      color: color,
      dimensions: dimensions,
      translation: translation,
      intersect: intersect ? {
        point: {
          x: intersect.point.x,
          y: intersect.point.y,
          z: intersect.point.z,
        },
        face: intersect.face ? {
          normal: {
            x: intersect.face.normal.x,
            y: intersect.face.normal.y,
            z: intersect.face.normal.z,
          }
        } : null,
      } : null,
    };
  });
}

/**
 * Deserialize JSON string to brick objects
 * Returns array of plain objects that can be used with setScene()
 */
export function deserializeBricks(jsonString) {
  try {
    if (!jsonString || jsonString.trim() === '') {
      return [];
    }

    const parsed = JSON.parse(jsonString);

    if (!Array.isArray(parsed)) {
      throw new Error('JSON must be an array of bricks');
    }

    // Validate basic structure
    for (const brick of parsed) {
      if (!brick.position || !brick.color) {
        throw new Error('Invalid brick structure - missing required fields');
      }
    }

    return parsed;
  } catch (err) {
    console.error('Brick deserialization failed:', err);
    throw new Error(`Failed to parse brick data: ${err.message}`);
  }
}

/**
 * Get all saved builds
 */
export function getAllBuilds() {
  const data = getStorageData();
  return data.builds || [];
}

/**
 * Save a build (script + bricks JSON)
 * @param {string} name - Build name
 * @param {string} script - JavaScript code
 * @param {Array} bricks - Array of Brick objects
 * @returns {object} The saved build object
 */
export function saveBuild(name, script, bricks) {
  if (!name || name.trim() === '') {
    throw new Error('Build name is required');
  }

  if (name.length > 100) {
    throw new Error('Build name is too long (max 100 characters)');
  }

  try {
    const data = getStorageData();

    // Serialize bricks to JSON
    const serializedBricks = serializeBricks(bricks);
    const jsonString = JSON.stringify(serializedBricks, null, 2);

    // Create build object
    const build = {
      id: `build_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      script: script || '',
      json: jsonString,
      timestamp: Date.now(),
      metadata: {
        brickCount: serializedBricks.length,
        lastModified: Date.now(),
      },
    };

    // Add to builds array
    data.builds.push(build);

    // Save to localStorage
    setStorageData(data);

    return build;
  } catch (err) {
    handleStorageError(err);
    throw err;
  }
}

/**
 * Load a build by ID
 * @param {string} buildId - Build ID
 * @returns {object|null} Build object or null if not found
 */
export function loadBuild(buildId) {
  const data = getStorageData();
  return data.builds.find(b => b.id === buildId) || null;
}

/**
 * Delete a build by ID
 * @param {string} buildId - Build ID
 * @returns {boolean} True if deleted, false if not found
 */
export function deleteBuild(buildId) {
  try {
    const data = getStorageData();
    const initialLength = data.builds.length;

    data.builds = data.builds.filter(b => b.id !== buildId);

    if (data.builds.length === initialLength) {
      return false; // Not found
    }

    setStorageData(data);
    return true;
  } catch (err) {
    handleStorageError(err);
    throw err;
  }
}

/**
 * Handle storage errors with user-friendly messages
 */
export function handleStorageError(error) {
  console.error('Storage error:', error);

  if (error.name === 'QuotaExceededError') {
    alert('Storage is full! Please delete some saved builds to make room.');
  } else if (error.message.includes('localStorage is not available')) {
    alert('Browser storage is not available. Please check your browser settings.');
  } else {
    alert(`Storage error: ${error.message}`);
  }
}

/**
 * Clear all storage data (for testing/debugging)
 * WARNING: This deletes all saved builds!
 */
export function clearAllStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    initStorage();
  } catch (err) {
    handleStorageError(err);
  }
}

/**
 * Get storage usage statistics
 */
export function getStorageStats() {
  try {
    const data = getStorageData();
    const jsonString = JSON.stringify(data);

    return {
      totalBuilds: data.builds.length,
      totalBricks: data.builds.reduce((sum, build) => {
        return sum + (build.metadata?.brickCount || 0);
      }, 0),
      storageSize: jsonString.length,
      storageSizeKB: (jsonString.length / 1024).toFixed(2),
    };
  } catch (err) {
    console.error('Failed to get storage stats:', err);
    return null;
  }
}
