import { getMeasurementsFromDimensions } from './index';

/**
 * CollisionManager - Handles 3D bounding box collision detection for bricks
 *
 * Uses Axis-Aligned Bounding Box (AABB) intersection tests instead of
 * point-based distance checks to accurately detect overlapping bricks
 * of different sizes.
 */
export class CollisionManager {
  constructor(bricks) {
    this.bricks = bricks;
  }

  /**
   * Calculate Axis-Aligned Bounding Box (AABB) for a brick
   * @param {Object} position - {x, y, z} center position
   * @param {Object} dimensions - {x, z, y, type} brick dimensions
   * @returns {Object} {min: {x, y, z}, max: {x, y, z}}
   */
  getBounds(position, dimensions) {
    const { width, height, depth } = getMeasurementsFromDimensions(dimensions);

    // Calculate half-extents (brick position is at center)
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const halfDepth = depth / 2;

    return {
      min: {
        x: position.x - halfWidth,
        y: position.y - halfHeight,
        z: position.z - halfDepth
      },
      max: {
        x: position.x + halfWidth,
        y: position.y + halfHeight,
        z: position.z + halfDepth
      }
    };
  }

  /**
   * Test if two bounding boxes intersect using AABB collision test
   * @param {Object} bounds1 - First bounding box
   * @param {Object} bounds2 - Second bounding box
   * @param {number} tolerance - Small tolerance value to allow slight overlap (default: 1)
   * @returns {boolean} true if boxes intersect
   */
  boxesIntersect(bounds1, bounds2, tolerance = 1) {
    // 3D AABB intersection test
    // Two boxes intersect if they overlap on ALL three axes
    const xOverlap = (bounds1.min.x - tolerance) < bounds2.max.x &&
                     (bounds1.max.x + tolerance) > bounds2.min.x;
    const yOverlap = (bounds1.min.y - tolerance) < bounds2.max.y &&
                     (bounds1.max.y + tolerance) > bounds2.min.y;
    const zOverlap = (bounds1.min.z - tolerance) < bounds2.max.z &&
                     (bounds1.max.z + tolerance) > bounds2.min.z;

    return xOverlap && yOverlap && zOverlap;
  }

  /**
   * Find all bricks that collide with a given position and dimensions
   * @param {Object} position - {x, y, z} position to test
   * @param {Object} dimensions - {x, z, y, type} dimensions to test
   * @param {Array} excludeIds - Brick IDs to exclude from collision check
   * @param {number} tolerance - Collision tolerance (default: 1)
   * @returns {Array} Array of colliding brick objects
   */
  findCollisions(position, dimensions, excludeIds = [], tolerance = 1) {
    const testBounds = this.getBounds(position, dimensions);
    const collisions = [];

    for (const brick of this.bricks) {
      // Skip excluded bricks
      if (excludeIds.includes(brick.customId)) {
        continue;
      }

      // Get brick dimensions (stored in brick object)
      const brickDimensions = brick._dimensions || brick.dimensions;
      if (!brickDimensions) {
        continue;
      }

      // Calculate brick bounds
      const brickBounds = this.getBounds(brick.position, brickDimensions);

      // Test for intersection
      if (this.boxesIntersect(testBounds, brickBounds, tolerance)) {
        collisions.push(brick);
      }
    }

    return collisions;
  }

  /**
   * Check if a position is free (no collisions)
   * @param {Object} position - {x, y, z} position to test
   * @param {Object} dimensions - {x, z, y, type} dimensions to test
   * @param {Array} excludeIds - Brick IDs to exclude from collision check
   * @param {number} tolerance - Collision tolerance (default: 1)
   * @returns {boolean} true if position is free
   */
  isPositionFree(position, dimensions, excludeIds = [], tolerance = 1) {
    return this.findCollisions(position, dimensions, excludeIds, tolerance).length === 0;
  }

  /**
   * Get all bricks within a region (bounding box)
   * @param {Object} bounds - {min: {x,y,z}, max: {x,y,z}}
   * @returns {Array} Array of bricks within the region
   */
  getBricksInRegion(bounds) {
    const bricksInRegion = [];

    for (const brick of this.bricks) {
      const brickDimensions = brick._dimensions || brick.dimensions;
      if (!brickDimensions) {
        continue;
      }

      const brickBounds = this.getBounds(brick.position, brickDimensions);

      if (this.boxesIntersect(bounds, brickBounds, 0)) {
        bricksInRegion.push(brick);
      }
    }

    return bricksInRegion;
  }

  /**
   * Get the center point of a brick
   * @param {Object} brick - Brick object
   * @returns {Object} {x, y, z} center position
   */
  getCenter(brick) {
    return {
      x: brick.position.x,
      y: brick.position.y,
      z: brick.position.z
    };
  }

  /**
   * Calculate volume of a brick
   * @param {Object} dimensions - {x, z, y, type} brick dimensions
   * @returns {number} Volume in cubic units
   */
  getVolume(dimensions) {
    const { width, height, depth } = getMeasurementsFromDimensions(dimensions);
    return width * height * depth;
  }

  /**
   * Test if a position would collide before placing a brick
   * @param {Object} position - {x, y, z} position to test
   * @param {Object} dimensions - {x, z, y, type} dimensions to test
   * @param {Array} excludeIds - Brick IDs to exclude from collision check
   * @returns {Object} {collision: boolean, collidingBricks: Array}
   */
  testPosition(position, dimensions, excludeIds = []) {
    const collisions = this.findCollisions(position, dimensions, excludeIds);
    return {
      collision: collisions.length > 0,
      collidingBricks: collisions
    };
  }

  /**
   * Find a free position near a starting point using spiral search
   * @param {Object} start - {x, y, z} starting position
   * @param {Object} dimensions - {x, z, y, type} dimensions for the brick
   * @param {Object} options - {spacing: 25, maxRadius: 20, excludeIds: []}
   * @returns {Object|null} Free position or null if none found
   */
  findFreePosition(start, dimensions, options = {}) {
    const {
      spacing = 25,
      maxRadius = 20,
      excludeIds = []
    } = options;

    // Test the starting position first
    if (this.isPositionFree(start, dimensions, excludeIds)) {
      return start;
    }

    // Spiral outward from start position
    for (let radius = 1; radius <= maxRadius; radius++) {
      // Test positions in a square ring at this radius
      for (let x = -radius; x <= radius; x++) {
        for (let z = -radius; z <= radius; z++) {
          // Only test positions on the edge of the square (the ring)
          if (Math.abs(x) === radius || Math.abs(z) === radius) {
            const testPos = {
              x: start.x + x * spacing,
              y: start.y,
              z: start.z + z * spacing
            };

            if (this.isPositionFree(testPos, dimensions, excludeIds)) {
              return testPos;
            }
          }
        }
      }
    }

    // No free position found
    return null;
  }
}

/**
 * Create a CollisionManager instance from a bricks array
 * @param {Array} bricks - Array of brick objects
 * @returns {CollisionManager} New CollisionManager instance
 */
export function createCollisionManager(bricks) {
  return new CollisionManager(bricks);
}
