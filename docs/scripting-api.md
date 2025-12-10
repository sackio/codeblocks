# CodeBlocks Scripting API Reference

**Version 2.0** - Updated with collision detection and new animation system

## Table of Contents

1. [Introduction](#introduction)
2. [Quick Start](#quick-start)
3. [Core Concepts](#core-concepts)
4. [API Reference](#api-reference)
   - [Brick Creation](#brick-creation)
   - [Animation](#animation)
   - [Collision Detection](#collision-detection)
   - [Brick Query](#brick-query)
   - [Utility Functions](#utility-functions)
5. [Examples by Skill Level](#examples-by-skill-level)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

---

## Introduction

CodeBlocks provides a safe, beginner-friendly API for creating and animating 3D brick structures. The API is designed to work for all skill levels, from ages 5+ to professional developers.

### Key Features

- **Safe by Default**: Automatic collision detection prevents overlapping bricks
- **Reliable Animations**: Command-based animation system that won't freeze or crash
- **Progressive Complexity**: Simple for beginners, powerful for advanced users
- **Three.js Integration**: Full 3D rendering with WebGL

---

## Quick Start

### Your First Brick

```javascript
// Create a simple brick
const brick1 = createBrick({
  color: 'red',
  position: { x: 0, y: 24, z: 0 },
  dimensions: { x: 2, z: 2 }
});
```

### Your First Animation

```javascript
// Animate the brick
await animate(brick1)
  .color('blue')
  .wait(500)
  .move({ x: 50, y: 24, z: 0 })
  .run();
```

### Stack Bricks Safely

```javascript
// These won't overlap - collision detection prevents it!
const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

for (let i = 0; i < 6; i++) {
  createBrick({
    color: colors[i],
    position: { x: 0, y: i * 33 + 24, z: 0 },
    dimensions: { x: 2, z: 2 }
  });
  await wait(300);
}
```

---

## Core Concepts

### Coordinate System

- **X axis**: Left (-) to Right (+)
- **Y axis**: Down (-) to Up (+)
- **Z axis**: Back (-) to Front (+)
- **Origin**: (0, 0, 0) is at the center of the grid
- **Ground level**: Y = 24 (first brick position)

### Brick Dimensions

Dimensions use a logical stud-based system:

```javascript
dimensions: {
  x: 2,     // Width in studs (1-8)
  z: 2,     // Depth in studs (1-8)
  y: 1,     // Height multiplier (optional, default: 1)
  type: 'rectangle'  // Shape (optional)
}
```

**Measurement conversion:**
- Base unit = 25 (Three.js units per stud)
- Default height = 33 (Math.round((25 * 2) / 1.5))
- A 2x2 brick is 50x33x50 in Three.js units

### Collision Detection

By default, `createBrick()` checks for collisions:

```javascript
// This creates successfully
const brick1 = createBrick({
  position: { x: 0, y: 24, z: 0 }
});

// This returns null - position occupied!
const brick2 = createBrick({
  position: { x: 0, y: 24, z: 0 }
});

// Override with force parameter
const brick3 = createBrick({
  position: { x: 0, y: 24, z: 0 },
  force: true  // Forces creation despite collision
});
```

### Animation Commands

Animations use a command pattern that executes sequentially:

```javascript
await animate(brickId)
  .color('#ff0000')        // Change color
  .wait(500)               // Wait 500ms
  .move({ x: 50, y: 24, z: 0 })   // Move to position
  .moveBy({ x: 10, y: 0, z: 0 })  // Move relatively
  .rotate(Math.PI / 2)     // Rotate
  .run();                  // Execute all commands
```

---

## API Reference

### Brick Creation

#### `createBrick(options)`

Creates a new brick with collision checking by default.

**Parameters:**

```javascript
{
  type: 'rectangle',           // Brick type (default: 'rectangle')
  color: '#ff6b35',            // Color (hex, rgb, hsl, or name)
  position: { x, y, z },       // 3D position
  rotation: 0,                 // Rotation in radians (default: 0)
  dimensions: { x, z, y },     // Size in studs
  id: null,                    // Custom ID (optional)
  render: true,                // Render immediately (default: true)
  checkCollision: true,        // Check for collisions (default: true)
  force: false                 // Force creation even if collision (default: false)
}
```

**Returns:** `string | null`
- Returns the brick ID if successful
- Returns `null` if collision detected and `force: false`

**Examples:**

```javascript
// Simple creation
const brick1 = createBrick({
  color: 'blue',
  position: { x: 0, y: 24, z: 0 }
});

// Full options
const brick2 = createBrick({
  type: 'rectangle',
  color: '#ff0000',
  position: { x: 50, y: 24, z: 0 },
  rotation: Math.PI / 4,
  dimensions: { x: 4, z: 2, y: 2 },  // 4x2 studs, double height
  checkCollision: true
});

// Fast batch creation (skip collision for performance)
for (let i = 0; i < 100; i++) {
  createBrick({
    color: '#888888',
    position: { x: i * 25, y: 24, z: 0 },
    dimensions: { x: 1, z: 1 },
    checkCollision: false  // Faster when you know it's safe
  });
}
```

---

### Animation

#### `animate(brickId)`

Creates an animator for chaining animation commands.

**Returns:** `BrickAnimator` - Object with chainable command methods

**Chainable Methods:**

##### `.color(newColor)`
Changes the brick color.

```javascript
await animate(brick1)
  .color('#ff0000')
  .run();
```

##### `.move(position)`
Moves brick to absolute position.

```javascript
await animate(brick1)
  .move({ x: 100, y: 24, z: 50 })
  .run();
```

##### `.moveBy(delta)`
Moves brick relative to current position.

```javascript
await animate(brick1)
  .moveBy({ x: 25, y: 0, z: 0 })  // Move 25 units right
  .run();
```

##### `.rotate(angle)`
Rotates brick to angle (radians).

```javascript
await animate(brick1)
  .rotate(Math.PI / 2)  // 90 degrees
  .run();
```

##### `.wait(milliseconds)`
Pauses before next command.

```javascript
await animate(brick1)
  .color('red')
  .wait(1000)  // Wait 1 second
  .color('blue')
  .run();
```

##### `.delete()`
Removes the brick.

```javascript
await animate(brick1)
  .moveBy({ x: 0, y: 100, z: 0 })
  .wait(500)
  .delete()
  .run();
```

##### `.run()`
Executes all queued commands. **Must be called to run animations!**

```javascript
await animate(brick1)
  .color('red')
  .move({ x: 50, y: 24, z: 0 })
  .run();  // Actually executes the animation
```

**Complex Examples:**

```javascript
// Chained animation
await animate(brick1)
  .color('#ff0000')
  .wait(200)
  .moveBy({ x: 0, y: 50, z: 0 })
  .wait(300)
  .moveBy({ x: 0, y: -50, z: 0 })
  .color('#00ff00')
  .run();

// Parallel animations
await Promise.all([
  animate(brick1).move({ x: 100, y: 24, z: 0 }).run(),
  animate(brick2).move({ x: 100, y: 57, z: 0 }).run(),
  animate(brick3).move({ x: 100, y: 90, z: 0 }).run()
]);

// Loop animation
for (let i = 0; i < 5; i++) {
  await animate(brick1)
    .moveBy({ x: 0, y: 30, z: 0 })
    .wait(300)
    .moveBy({ x: 0, y: -30, z: 0 })
    .wait(300)
    .run();
}
```

---

### Collision Detection

#### `getCollisions(brickId)`

Returns all bricks overlapping with the specified brick.

**Parameters:**
- `brickId` (string): The brick to check

**Returns:** `Array<Object>` - Array of colliding brick objects

```javascript
const brick1 = createBrick({ position: { x: 0, y: 24, z: 0 } });
const brick2 = createBrick({ position: { x: 5, y: 24, z: 5 }, force: true });

const collisions = getCollisions(brick1);
console.log(`Brick has ${collisions.length} collision(s)`);

collisions.forEach(b => {
  console.log(`Collides with brick: ${b.id}`);
});
```

#### `testPosition(position, dimensions, excludeIds)`

Tests if a position is free before creating a brick.

**Parameters:**
- `position` (object): `{ x, y, z }` to test
- `dimensions` (object): `{ x, z }` size in studs
- `excludeIds` (array, optional): Brick IDs to ignore

**Returns:** `Object`
```javascript
{
  collision: boolean,           // True if collision detected
  collidingBricks: Array<Object>  // Array of colliding bricks
}
```

**Example:**

```javascript
const test = testPosition(
  { x: 50, y: 24, z: 50 },
  { x: 2, z: 2 }
);

if (!test.collision) {
  console.log("Position is free!");
  createBrick({
    position: { x: 50, y: 24, z: 50 },
    dimensions: { x: 2, z: 2 }
  });
} else {
  console.log(`Occupied by ${test.collidingBricks.length} brick(s)`);
}
```

#### `findFreePosition(start, dimensions, options)`

Finds the nearest free position using spiral search.

**Parameters:**
- `start` (object): `{ x, y, z }` starting position
- `dimensions` (object): `{ x, z }` size in studs
- `options` (object, optional):
  ```javascript
  {
    spacing: 25,      // Search grid spacing (default: 25)
    maxRadius: 20,    // Maximum search radius (default: 20)
    excludeIds: []    // Brick IDs to ignore (default: [])
  }
  ```

**Returns:** `Object | null`
- Returns `{ x, y, z }` position if found
- Returns `null` if no free position within search radius

**Example:**

```javascript
const preferredPos = { x: 0, y: 24, z: 0 };
const freePos = findFreePosition(
  preferredPos,
  { x: 2, z: 2 },
  { spacing: 30, maxRadius: 10 }
);

if (freePos) {
  createBrick({
    color: 'green',
    position: freePos,
    dimensions: { x: 2, z: 2 }
  });
} else {
  console.log("No free position found!");
}
```

#### `getBounds(brickId)`

Gets the AABB (Axis-Aligned Bounding Box) for a brick.

**Parameters:**
- `brickId` (string): The brick ID

**Returns:** `Object | null`
```javascript
{
  min: { x, y, z },  // Minimum corner
  max: { x, y, z }   // Maximum corner
}
```

**Example:**

```javascript
const bounds = getBounds(brick1);
console.log("Bounds:", bounds);
console.log(`Width: ${bounds.max.x - bounds.min.x}`);
console.log(`Height: ${bounds.max.y - bounds.min.y}`);
console.log(`Depth: ${bounds.max.z - bounds.min.z}`);
```

#### `getCenter(brickId)`

Gets the center point of a brick.

**Parameters:**
- `brickId` (string): The brick ID

**Returns:** `Object | null` - `{ x, y, z }` center position

```javascript
const center = getCenter(brick1);
console.log(`Center: (${center.x}, ${center.y}, ${center.z})`);
```

#### `getVolume(brickId)`

Calculates the volume of a brick.

**Parameters:**
- `brickId` (string): The brick ID

**Returns:** `number | null` - Volume in cubic units

```javascript
const volume = getVolume(brick1);
console.log(`Brick volume: ${volume} cubic units`);
```

#### `getBricksInRegion(bounds)`

Finds all bricks within a specified 3D region.

**Parameters:**
- `bounds` (object): Region definition
  ```javascript
  {
    min: { x, y, z },  // Minimum corner
    max: { x, y, z }   // Maximum corner
  }
  ```

**Returns:** `Array<Object>` - Array of bricks in region

**Example:**

```javascript
// Find all bricks in a layer
const layer1 = getBricksInRegion({
  min: { x: -1000, y: 20, z: -1000 },
  max: { x: 1000, y: 28, z: 1000 }
});
console.log(`Layer 1 has ${layer1.length} brick(s)`);

// Find bricks in a specific area
const area = getBricksInRegion({
  min: { x: 0, y: 0, z: 0 },
  max: { x: 100, y: 100, z: 100 }
});
console.log(`Found ${area.length} brick(s) in region`);
```

---

### Brick Query

#### `brick(brickId)`

Gets information about a brick.

**Parameters:**
- `brickId` (string): The brick ID

**Returns:** `Object | null`
```javascript
{
  id: string,              // Brick ID
  position: { x, y, z },   // Current position
  color: string,           // Current color
  dimensions: { x, z, y }  // Size dimensions
}
```

**Example:**

```javascript
const info = brick(brick1);
if (info) {
  console.log(`Brick ${info.id} at (${info.position.x}, ${info.position.y}, ${info.position.z})`);
  console.log(`Color: ${info.color}`);
  console.log(`Size: ${info.dimensions.x}x${info.dimensions.z}`);
}
```

#### `findBricksAt(position, tolerance)`

Finds bricks near a specific position.

**Parameters:**
- `position` (object): `{ x, y, z }` to search
- `tolerance` (number, optional): Search radius (default: 5)

**Returns:** `Array<Object>` - Array of nearby brick objects

```javascript
const nearby = findBricksAt({ x: 50, y: 24, z: 0 }, 10);
console.log(`Found ${nearby.length} brick(s) near position`);

nearby.forEach(b => {
  console.log(`Brick ${b.id} at (${b.position.x}, ${b.position.y}, ${b.position.z})`);
});
```

#### `findBricksByColor(color)`

Finds all bricks of a specific color.

**Parameters:**
- `color` (string): Color to match (hex, rgb, hsl, or name)

**Returns:** `Array<Object>` - Array of matching brick objects

```javascript
const redBricks = findBricksByColor('#ff0000');
console.log(`Found ${redBricks.length} red brick(s)`);

// Animate all red bricks
for (const b of redBricks) {
  await animate(b.id).moveBy({ x: 0, y: 10, z: 0 }).run();
}
```

#### `findBrickById(brickId)`

Finds a brick by its ID.

**Parameters:**
- `brickId` (string): The brick ID to find

**Returns:** `Object | null` - Brick object if found, null otherwise

```javascript
const found = findBrickById(brick1);
if (found) {
  console.log("Found brick:", found);
}
```

---

### Utility Functions

#### `wait(milliseconds)`

Pauses execution for specified time.

**Parameters:**
- `milliseconds` (number): Time to wait

**Returns:** `Promise` - Resolves after delay

```javascript
console.log("Before wait");
await wait(1000);
console.log("After 1 second");
```

#### `getAllBricks()`

Gets all bricks in the scene.

**Returns:** `Array<Object>` - Array of all brick objects

```javascript
const all = getAllBricks();
console.log(`Total bricks: ${all.length}`);

// Calculate total volume
let totalVolume = 0;
for (const b of all) {
  totalVolume += getVolume(b.id) || 0;
}
console.log(`Total volume: ${totalVolume}`);
```

#### `deleteBrick(brickId)`

Removes a brick from the scene.

**Parameters:**
- `brickId` (string): The brick ID to delete

```javascript
deleteBrick(brick1);
```

#### `deleteAllBricks()`

Removes all bricks from the scene.

```javascript
deleteAllBricks();
console.log("Scene cleared!");
```

#### `setBrickColor(brickId, color)`

Changes a brick's color immediately (no animation).

**Parameters:**
- `brickId` (string): The brick ID
- `color` (string): New color

```javascript
setBrickColor(brick1, '#ff0000');
```

#### `moveBrick(brickId, position)`

Moves a brick immediately (no animation).

**Parameters:**
- `brickId` (string): The brick ID
- `position` (object): `{ x, y, z }` new position

```javascript
moveBrick(brick1, { x: 100, y: 24, z: 0 });
```

---

## Examples by Skill Level

### Beginner Examples

See `app/utils/examples-beginner.js` for 10 beginner examples including:
- Rainbow Stack
- Color Dance
- Moving Brick
- Collision Demo
- Simple Tower
- Traffic Light

### Intermediate Examples

See `app/utils/examples-intermediate.js` for 10 intermediate examples including:
- Collision-Aware Builder
- Smart Stacking
- Region Query
- Parallel Animations
- Bounds Analysis
- Grid Builder with Gaps

### Advanced Examples

See `app/utils/examples-advanced.js` for 9 advanced examples including:
- Optimized Batch Creation
- Spiral Galaxy
- Collision Physics Simulator
- Space Partitioning Grid
- Procedural Building Generator
- Wave Propagation
- Fractal Tree
- Automatic Collision Resolver
- Choreographed Dance

---

## Best Practices

### 1. Use Collision Detection

Always rely on the default collision detection for safety:

```javascript
// ✅ Good - Safe by default
const brick = createBrick({
  position: { x: 0, y: 24, z: 0 }
});

if (!brick) {
  console.log("Position occupied, finding alternative...");
  const freePos = findFreePosition({ x: 0, y: 24, z: 0 }, { x: 2, z: 2 });
  if (freePos) {
    createBrick({ position: freePos });
  }
}

// ❌ Bad - Forces overlaps
const brick = createBrick({
  position: { x: 0, y: 24, z: 0 },
  force: true  // Only use when absolutely necessary
});
```

### 2. Always await animate().run()

Animations must be awaited to execute properly:

```javascript
// ✅ Good
await animate(brick1)
  .color('red')
  .move({ x: 50, y: 24, z: 0 })
  .run();

// ❌ Bad - Animation won't execute
animate(brick1)
  .color('red')
  .move({ x: 50, y: 24, z: 0 });
  // Missing .run()!
```

### 3. Test Positions Before Creating

For complex scenarios, test before creating:

```javascript
// ✅ Good
const test = testPosition({ x: 50, y: 24, z: 0 }, { x: 2, z: 2 });
if (!test.collision) {
  createBrick({
    position: { x: 50, y: 24, z: 0 },
    dimensions: { x: 2, z: 2 }
  });
} else {
  console.log(`Blocked by ${test.collidingBricks.length} brick(s)`);
}
```

### 4. Use Parallel Animations for Performance

Run independent animations in parallel:

```javascript
// ✅ Good - Parallel execution
await Promise.all([
  animate(brick1).move({ x: 100, y: 24, z: 0 }).run(),
  animate(brick2).move({ x: 100, y: 57, z: 0 }).run(),
  animate(brick3).move({ x: 100, y: 90, z: 0 }).run()
]);

// ❌ Slower - Sequential execution
await animate(brick1).move({ x: 100, y: 24, z: 0 }).run();
await animate(brick2).move({ x: 100, y: 57, z: 0 }).run();
await animate(brick3).move({ x: 100, y: 90, z: 0 }).run();
```

### 5. Optimize Batch Operations

Disable collision checking for known-safe bulk operations:

```javascript
// Creating a perfect grid - we know there are no collisions
for (let x = 0; x < 10; x++) {
  for (let z = 0; z < 10; z++) {
    createBrick({
      position: { x: x * 50, y: 24, z: z * 50 },
      dimensions: { x: 2, z: 2 },
      checkCollision: false  // Safe to skip - grid is perfect
    });
  }
}

// Validate afterwards if needed
const all = getAllBricks();
for (const b of all) {
  const collisions = getCollisions(b.id);
  if (collisions.length > 0) {
    console.warn(`Brick ${b.id} has collisions!`);
  }
}
```

### 6. Clean Up Resources

Remove unused bricks to maintain performance:

```javascript
// Delete individual bricks
deleteBrick(brick1);

// Clear entire scene
deleteAllBricks();

// Selective cleanup
const oldBricks = findBricksByColor('#888888');
for (const b of oldBricks) {
  await animate(b.id)
    .moveBy({ x: 0, y: -50, z: 0 })
    .delete()
    .run();
}
```

---

## Troubleshooting

### Brick Not Creating

**Problem:** `createBrick()` returns `null`

**Solutions:**
1. Check for collisions:
   ```javascript
   const test = testPosition(position, dimensions);
   console.log("Collision:", test.collision);
   console.log("Colliding bricks:", test.collidingBricks);
   ```

2. Use `findFreePosition()`:
   ```javascript
   const freePos = findFreePosition(position, dimensions);
   if (freePos) {
     createBrick({ position: freePos, dimensions });
   }
   ```

3. Force creation (use cautiously):
   ```javascript
   createBrick({ position, dimensions, force: true });
   ```

### Animation Not Running

**Problem:** Animation commands don't execute

**Solutions:**
1. Always call `.run()`:
   ```javascript
   await animate(brick).color('red').run();  // ✅
   ```

2. Always use `await`:
   ```javascript
   await animate(brick).color('red').run();  // ✅
   ```

3. Check brick exists:
   ```javascript
   const info = brick(brickId);
   if (info) {
     await animate(brickId).color('red').run();
   }
   ```

### Performance Issues

**Problem:** Script runs slowly with many bricks

**Solutions:**
1. Disable collision checking for bulk operations:
   ```javascript
   createBrick({ checkCollision: false });
   ```

2. Use parallel animations:
   ```javascript
   await Promise.all(animations);
   ```

3. Reduce animation complexity:
   ```javascript
   // Instead of animating every frame
   for (let i = 0; i < 100; i++) {
     await animate(brick).moveBy({ x: 1, y: 0, z: 0 }).run();
   }

   // Animate to final position
   await animate(brick).move({ x: 100, y: 24, z: 0 }).run();
   ```

### Unexpected Collisions

**Problem:** Getting collision warnings for valid positions

**Solutions:**
1. Check tolerance parameter:
   ```javascript
   const test = testPosition(pos, dims);
   // Default tolerance is 1 unit
   ```

2. Visualize bounds:
   ```javascript
   const bounds = getBounds(brickId);
   console.log("Bounds:", bounds);
   console.log(`Size: ${bounds.max.x - bounds.min.x} x ${bounds.max.y - bounds.min.y} x ${bounds.max.z - bounds.min.z}`);
   ```

3. Use region query to debug:
   ```javascript
   const nearby = getBricksInRegion({
     min: { x: pos.x - 50, y: pos.y - 50, z: pos.z - 50 },
     max: { x: pos.x + 50, y: pos.y + 50, z: pos.z + 50 }
   });
   console.log("Nearby bricks:", nearby);
   ```

---

## Migration from v1.x

### Removed: BrickAPI Class

The old `BrickAPI` wrapper class has been removed. Bricks are now accessed by ID:

```javascript
// ❌ Old (v1.x)
const brick = createBrick({ color: 'red' });
brick.color('blue');
brick.move({ x: 50, y: 24, z: 0 });

// ✅ New (v2.0)
const brickId = createBrick({ color: 'red' });
await animate(brickId)
  .color('blue')
  .move({ x: 50, y: 24, z: 0 })
  .run();
```

### Changed: Default Collision Checking

Collision checking is now enabled by default:

```javascript
// Old behavior (v1.x): No collision checking
createBrick({ position: { x: 0, y: 24, z: 0 } });

// New behavior (v2.0): Collision checking enabled
const brick = createBrick({ position: { x: 0, y: 24, z: 0 } });
// Returns null if position occupied

// Disable for old behavior
createBrick({
  position: { x: 0, y: 24, z: 0 },
  checkCollision: false
});
```

### Changed: Animation System

Animations now use command pattern and require `.run()`:

```javascript
// ❌ Old (v1.x)
brick.color('red');
await wait(500);
brick.move({ x: 50, y: 24, z: 0 });

// ✅ New (v2.0)
await animate(brickId)
  .color('red')
  .wait(500)
  .move({ x: 50, y: 24, z: 0 })
  .run();
```

---

## Additional Resources

- **Test Scripts**: See `/test-scripts/` for comprehensive API tests
- **Examples**: See `/app/utils/examples-*.js` for examples by skill level
- **Source Code**: See `/app/components/ScriptEditor.jsx` for full API implementation

---

**Last Updated:** December 10, 2024
**API Version:** 2.0
