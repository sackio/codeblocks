/**
 * BrickAnimator - Command pattern for brick animations
 *
 * Replaces the buggy BrickAPI class with a simpler, more reliable
 * command-based animation system. Commands are queued and executed
 * sequentially when run() is called.
 *
 * Usage:
 *   const brick = createBrick({ color: 'red' });
 *   await animate(brick.id)
 *     .color('blue')
 *     .wait(500)
 *     .move({x: 50, y: 25, z: 0})
 *     .run();
 */
export class BrickAnimator {
  /**
   * Create a new BrickAnimator
   * @param {string} brickId - ID of the brick to animate
   * @param {Object} api - Reference to the scripting API
   * @param {Array} bricks - Reference to the bricks array
   */
  constructor(brickId, api, bricks) {
    this.brickId = brickId;
    this.api = api;
    this.bricks = bricks;
    this.commands = [];
  }

  /**
   * Add a color change command
   * @param {string} newColor - New color (hex, named color, or rgba)
   * @returns {BrickAnimator} this for chaining
   */
  color(newColor) {
    this.commands.push({
      type: 'color',
      value: newColor
    });
    return this;
  }

  /**
   * Add a move command (absolute position)
   * @param {Object} position - {x, y, z} target position
   * @returns {BrickAnimator} this for chaining
   */
  move(position) {
    this.commands.push({
      type: 'move',
      value: position
    });
    return this;
  }

  /**
   * Add a relative move command (delta)
   * @param {Object} delta - {x?, y?, z?} movement offset
   * @returns {BrickAnimator} this for chaining
   */
  moveBy(delta) {
    this.commands.push({
      type: 'moveBy',
      value: delta
    });
    return this;
  }

  /**
   * Add a rotation command
   * @param {number} angle - Rotation angle in radians
   * @returns {BrickAnimator} this for chaining
   */
  rotate(angle) {
    this.commands.push({
      type: 'rotate',
      value: angle
    });
    return this;
  }

  /**
   * Add a wait/pause command
   * @param {number} ms - Milliseconds to wait
   * @returns {BrickAnimator} this for chaining
   */
  wait(ms) {
    this.commands.push({
      type: 'wait',
      value: ms
    });
    return this;
  }

  /**
   * Add a delete command (will be executed last)
   * @returns {BrickAnimator} this for chaining
   */
  delete() {
    this.commands.push({
      type: 'delete'
    });
    return this;
  }

  /**
   * Execute a single command
   * @param {Object} command - Command to execute
   * @private
   */
  async executeCommand(command) {
    const brick = this.bricks.find(b => b.customId === this.brickId);

    if (!brick && command.type !== 'wait') {
      console.warn(`BrickAnimator: Brick ${this.brickId} not found`);
      return;
    }

    switch (command.type) {
      case 'color':
        this.api.setBrickColor(this.brickId, command.value);
        break;

      case 'move':
        this.api.moveBrick(this.brickId, command.value);
        break;

      case 'moveBy':
        const currentPos = {
          x: brick.position.x,
          y: brick.position.y,
          z: brick.position.z
        };
        const newPos = {
          x: currentPos.x + (command.value.x || 0),
          y: currentPos.y + (command.value.y || 0),
          z: currentPos.z + (command.value.z || 0)
        };
        this.api.moveBrick(this.brickId, newPos);
        break;

      case 'rotate':
        if (brick) {
          brick.rotation.y = command.value;
          // Update Redux state
          if (this.api._updateObject) {
            this.api._updateObject(brick);
          }
        }
        break;

      case 'wait':
        await this.api.wait(command.value);
        break;

      case 'delete':
        this.api.deleteBrick(this.brickId);
        break;

      default:
        console.warn(`BrickAnimator: Unknown command type '${command.type}'`);
    }
  }

  /**
   * Execute all queued commands sequentially
   * @returns {Promise<BrickAnimator>} Promise that resolves when all commands complete
   */
  async run() {
    try {
      for (const command of this.commands) {
        await this.executeCommand(command);
      }
      // Clear commands after execution
      this.commands = [];
      return this;
    } catch (error) {
      console.error('BrickAnimator error:', error);
      throw error;
    }
  }

  /**
   * Get current position of the brick
   * @returns {Object|null} {x, y, z} position or null if brick not found
   */
  getPosition() {
    const brick = this.bricks.find(b => b.customId === this.brickId);
    return brick ? {
      x: brick.position.x,
      y: brick.position.y,
      z: brick.position.z
    } : null;
  }

  /**
   * Get current color of the brick
   * @returns {Object|null} color object or null if brick not found
   */
  getColor() {
    const brick = this.bricks.find(b => b.customId === this.brickId);
    return brick ? (brick._color || brick.color) : null;
  }

  /**
   * Get the brick ID
   * @returns {string} Brick ID
   */
  getId() {
    return this.brickId;
  }
}

/**
 * Create a BrickAnimator instance
 * @param {string} brickId - ID of the brick to animate
 * @param {Object} api - Reference to the scripting API
 * @param {Array} bricks - Reference to the bricks array
 * @returns {BrickAnimator} New BrickAnimator instance
 */
export function createAnimator(brickId, api, bricks) {
  return new BrickAnimator(brickId, api, bricks);
}
