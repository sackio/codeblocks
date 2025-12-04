# CodeBlocks Scripting API Reference

CodeBlocks provides a powerful JavaScript API for creating 3D brick structures programmatically. This API allows you to create, manipulate, and animate brick scenes.

## Core Brick Functions

### createBrick(options)
Creates a new brick at the specified position.

**Parameters (single options object with all properties optional):**
- `type` (string): Brick type - see available types below (default: 'rectangle')
- `color` (string): Color as hex string like `'#ff0000'` or `'#ffaa33'` (default: '#ff6b35')
- `position` (object): Position with `{x, y, z}` coordinates (default: `{x: 0, y: 12, z: 0}`)
- `rotation` (number): Rotation in radians (default: 0)
- `dimensions` (object): Size with `{x: width, z: length}` in studs (default: `{x: 2, z: 2}`)
- `id` (string|null): Optional custom identifier for this brick (default: null - auto-generated)
- `render` (boolean): Whether to add brick to scene immediately (default: true)

**Returns:** BrickAPI object for method chaining

**Example:**
```javascript
// Red rectangle brick
createBrick({
  type: 'rectangle',
  color: '#ff0000',
  position: { x: 0, y: 24, z: 0 },
  dimensions: { x: 2, z: 2 }
});

// Yellow cylinder (larger, higher)
createBrick({
  type: 'cylinder',
  color: '#ffff00',
  position: { x: 50, y: 48, z: 0 },
  dimensions: { x: 4, z: 4 }
});

// Blue slope at an angle
createBrick({
  type: 'slope45',
  color: '#0088ff',
  position: { x: 100, y: 24, z: 0 },
  rotation: Math.PI / 4, // 45 degrees
  dimensions: { x: 2, z: 2 }
});

// Brick with custom ID
createBrick({
  type: 'rectangle',
  color: '#ff0000',
  position: { x: 0, y: 24, z: 0 },
  id: 'foundation-brick-1'
});

// Create brick without rendering (add to scene later)
const brick = createBrick({
  type: 'rectangle',
  color: '#00ff00',
  position: { x: 50, y: 24, z: 0 },
  render: false
});
```

### clearScene()
Removes all bricks from the scene.

**Example:**
```javascript
clearScene();
```

## Collision Detection & Positioning

### Helper Constants
Useful constants for brick positioning:
- `BRICK_HEIGHT` (24): Standard brick height
- `BRICK_SPACING` (25): Recommended spacing between bricks
- `STUD_SIZE` (10): Size of a single stud

**Example:**
```javascript
// Stack bricks using standard height
for (let i = 0; i < 5; i++) {
  createBrick({
    position: { x: 0, y: i * BRICK_HEIGHT, z: 0 }
  });
}
```

### isPositionOccupied(position, tolerance)
Check if a position is already occupied by a brick.

**Parameters:**
- `position` (object): Position to check `{x, y, z}`
- `tolerance` (number): Distance tolerance in units (default: 5)

**Returns:** Boolean - true if position is occupied, false if free

**Example:**
```javascript
const pos = { x: 0, y: 24, z: 0 };

if (!isPositionOccupied(pos)) {
  createBrick({ position: pos, color: '#ff0000' });
} else {
  console.log('Position already occupied!');
}
```

### snapToGrid(position, gridSize)
Snap a position to the nearest grid point.

**Parameters:**
- `position` (object): Position to snap `{x, y, z}`
- `gridSize` (number): Grid spacing in units (default: 25)

**Returns:** Snapped position object `{x, y, z}`

**Example:**
```javascript
const unaligned = { x: 13, y: 28, z: 42 };
const aligned = snapToGrid(unaligned);
// Result: { x: 0, y: 24, z: 50 }

createBrick({
  position: aligned,
  color: '#0088ff'
});
```

### getNextFreePosition(startPos, spacing, maxSearch)
Find the next unoccupied position in a spiral pattern.

**Parameters:**
- `startPos` (object): Starting position `{x, y, z}` (default: `{x: 0, y: 24, z: 0}`)
- `spacing` (number): Spacing between positions (default: 25)
- `maxSearch` (number): Maximum positions to check (default: 100)

**Returns:** Next free position object `{x, y, z}`, or null if no free position found

**Example:**
```javascript
// Create 20 bricks without overlapping
clearScene();

for (let i = 0; i < 20; i++) {
  const pos = getNextFreePosition();

  if (pos) {
    createBrick({
      position: pos,
      color: '#ff6b35'
    });
  }
}
```

## Query Functions

### getBrickCount()
Get the total number of bricks in the scene.

**Returns:** Number of bricks

**Example:**
```javascript
console.log(`Total bricks: ${getBrickCount()}`);
```

### findBricksAt(position, tolerance)
Find all bricks at or near a specific position.

**Parameters:**
- `position` (object): Position to search `{x, y, z}`
- `tolerance` (number): Distance tolerance (default: 5)

**Returns:** Array of brick IDs

**Example:**
```javascript
const bricksAtOrigin = findBricksAt({ x: 0, y: 24, z: 0 });
console.log(`Found ${bricksAtOrigin.length} bricks at origin`);
```

### findBricksByColor(color)
Find all bricks of a specific color.

**Parameters:**
- `color` (string): Hex color string like '#ff0000'

**Returns:** Array of brick IDs

**Example:**
```javascript
const redBricks = findBricksByColor('#ff0000');
console.log(`Found ${redBricks.length} red bricks`);

// Delete all red bricks
deleteBricks(redBricks);
```

### findBrickById(id)
Find a brick by its custom ID.

**Parameters:**
- `id` (string): Custom brick ID

**Returns:** Brick ID if found, or null

**Example:**
```javascript
createBrick({
  position: { x: 0, y: 24, z: 0 },
  color: '#ff0000',
  id: 'my-special-brick'
});

const brick = findBrickById('my-special-brick');
if (brick) {
  console.log('Found the special brick!');
}
```

## Batch Operations

### createBricks(brickOptions)
Create multiple bricks at once.

**Parameters:**
- `brickOptions` (array): Array of options objects (same format as createBrick)

**Returns:** Array of BrickAPI objects

**Example:**
```javascript
const newBricks = createBricks([
  { position: { x: 0, y: 24, z: 0 }, color: '#ff0000' },
  { position: { x: 25, y: 24, z: 0 }, color: '#00ff00' },
  { position: { x: 50, y: 24, z: 0 }, color: '#0000ff' }
]);

console.log(`Created ${newBricks.length} bricks`);
```

### deleteBricks(brickIds)
Delete multiple bricks at once.

**Parameters:**
- `brickIds` (array): Array of brick IDs to delete

**Example:**
```javascript
// Delete all red bricks
const redBricks = findBricksByColor('#ff0000');
deleteBricks(redBricks);

// Delete specific bricks
deleteBricks(['brick-1', 'brick-2', 'brick-3']);
```

## Helper Functions

### wait(ms)
Pauses script execution for the specified time. Always use `await` with this function.

**Parameters:**
- `ms` (number): Milliseconds to wait

**Returns:** Promise that resolves after the specified time

**Example:**
```javascript
await wait(500); // Wait half a second
await wait(1000); // Wait 1 second
```

## Camera Functions

### View Presets
Functions to quickly change camera angle:
- `setTopView()` - View from directly above
- `setFrontView()` - View from the front
- `setSideView()` - View from the side
- `setIsometricView()` - Classic isometric 3D view (default)
- `resetView()` - Reset to default isometric view

**Example:**
```javascript
setTopView(); // Switch to top-down view
await wait(1000);
setIsometricView(); // Switch back to 3D view
```

## Brick Types

Available brick types (use in the `type` parameter):

**Basic Shapes:**
- `'rectangle'` - Standard rectangular brick (default)
- `'cylinder'` - Round cylindrical piece
- `'cone'` - Cone-shaped piece

**Slopes:**
- `'slope45'` - 45-degree slope
- `'slope33'` - 33-degree slope (gentler)
- `'slopeInverted'` - Upside-down slope
- `'wedge'` - Triangular wedge piece

**Corners & Curves:**
- `'cornerInside'` - Inside corner piece
- `'cornerOutside'` - Outside corner piece
- `'cornerRound'` - Rounded corner
- `'curve'` - Curved piece
- `'arch'` - Arch-shaped piece

**Thin Pieces:**
- `'plate'` - Thin flat plate (1/3 normal height)
- `'tile'` - Smooth tile with no studs on top

## Common Patterns & Examples

### Preventing Overlapping Bricks
**IMPORTANT**: Use these techniques to avoid creating overlapping bricks!

```javascript
clearScene();

// Method 1: Use getNextFreePosition() for automatic placement
for (let i = 0; i < 30; i++) {
  const pos = getNextFreePosition();

  if (pos) {
    createBrick({
      position: pos,
      color: '#ff6b35'
    });
  }
}

// Method 2: Check before placing
const positions = [
  { x: 0, y: 24, z: 0 },
  { x: 0, y: 24, z: 0 },  // Duplicate - will be skipped
  { x: 25, y: 24, z: 0 }
];

positions.forEach(pos => {
  if (!isPositionOccupied(pos)) {
    createBrick({ position: pos, color: '#00ff00' });
  } else {
    console.log('Skipping occupied position:', pos);
  }
});

// Method 3: Use snapToGrid() to align positions
const randomPositions = [
  { x: 13, y: 28, z: 42 },
  { x: 67, y: 51, z: 88 }
];

randomPositions.forEach(pos => {
  const aligned = snapToGrid(pos);

  if (!isPositionOccupied(aligned)) {
    createBrick({
      position: aligned,
      color: '#0088ff'
    });
  }
});
```

### Creating a Simple Tower
```javascript
clearScene();

for (let i = 0; i < 10; i++) {
  createBrick({
    type: 'rectangle',
    color: '#ff6b35',
    position: { x: 0, y: i * 24, z: 0 },
    dimensions: { x: 2, z: 2 }
  });
  await wait(100); // Animate brick placement
}
```

### Creating a Colorful Rainbow Wall
```javascript
clearScene();

const rainbowColors = [
  '#ff0000',  // Red
  '#ff7700',  // Orange
  '#ffdd00',  // Yellow
  '#00ff00',  // Green
  '#0088ff',  // Blue
  '#8800ff',  // Purple
];

for (let i = 0; i < rainbowColors.length; i++) {
  createBrick({
    type: 'rectangle',
    color: rainbowColors[i],
    position: { x: i * 50, y: 24, z: 0 },
    dimensions: { x: 2, z: 2 }
  });
  await wait(150);
}
```

### Creating a Pyramid
```javascript
clearScene();

const baseSize = 5;
const brickSpacing = 25;
const color = '#ffaa33';

for (let level = 0; level < baseSize; level++) {
  const size = baseSize - level;
  const offset = level * (brickSpacing / 2);

  for (let x = 0; x < size; x++) {
    for (let z = 0; z < size; z++) {
      createBrick({
        type: 'rectangle',
        color: color,
        position: {
          x: x * brickSpacing + offset,
          y: level * 24,
          z: z * brickSpacing + offset
        },
        dimensions: { x: 2, z: 2 }
      });
      await wait(30);
    }
  }
}
```

### Creating a Wave Pattern
```javascript
clearScene();

const amplitude = 3;
const frequency = 0.5;

for (let x = 0; x < 20; x++) {
  const height = Math.sin(x * frequency) * amplitude;
  const y = (5 + height) * 24;

  createBrick({
    type: 'rectangle',
    color: '#0096ff',
    position: { x: x * 50, y: y, z: 0 },
    dimensions: { x: 2, z: 2 }
  });
  await wait(50);
}
```

### Showing All Available Shapes
```javascript
clearScene();

const shapes = [
  'rectangle', 'cylinder', 'cone', 'slope45', 'slope33',
  'slopeInverted', 'wedge', 'arch', 'curve', 'cornerInside',
  'cornerOutside', 'cornerRound', 'plate', 'tile'
];

const spacing = 50;

for (let i = 0; i < shapes.length; i++) {
  const x = (i % 5) * spacing;
  const z = Math.floor(i / 5) * spacing;

  createBrick({
    type: shapes[i],
    color: '#ff6b35',
    position: { x, y: 24, z },
    dimensions: { x: 2, z: 2 }
  });

  await wait(150);
}
```

## Color Reference

Colors must be specified as hex strings. Here are some common colors:

**Basic Colors:**
- Red: `'#ff0000'`
- Green: `'#00ff00'`
- Blue: `'#0000ff'`
- Yellow: `'#ffff00'`
- Cyan: `'#00ffff'`
- Magenta: `'#ff00ff'`
- White: `'#ffffff'`
- Black: `'#000000'`

**Orange Shades:**
- Light Orange: `'#ffaa33'`
- Orange: `'#ff9800'`
- Dark Orange: `'#ff6b35'`

You can use any hex color code - just make sure it starts with `#` followed by 6 hex digits.

## Important Notes

1. **Preventing Overlaps**: Always check if a position is occupied before placing bricks:
   - Use `getNextFreePosition()` for automatic non-overlapping placement
   - Use `isPositionOccupied()` to check before creating bricks
   - Use `snapToGrid()` to align positions properly
   - The AI should ALWAYS use these functions to prevent overlapping bricks

2. **Position Units**: The y-axis (height) typically uses multiples of 24 (brick height). X and Z can use any values but 25-50 units gives good spacing.
   - Use `BRICK_HEIGHT` constant (24) for vertical spacing
   - Use `BRICK_SPACING` constant (25) for horizontal spacing

3. **Async/Await**: Always use `await` before `wait()` calls for proper animation timing:
   ```javascript
   await wait(100); // Correct
   wait(100); // Wrong - won't pause
   ```

4. **Rotation**: Rotation is in radians, not degrees:
   - 90 degrees = `Math.PI / 2`
   - 180 degrees = `Math.PI`
   - 360 degrees = `Math.PI * 2`

5. **Dimensions**: The `x` and `z` values represent brick size in "studs" (LEGO units):
   - `{x: 2, z: 2}` = 2x2 brick (square)
   - `{x: 2, z: 4}` = 2x4 brick (rectangular)
   - `{x: 4, z: 4}` = 4x4 brick (large square)

6. **Performance**: Creating many bricks at once may cause lag - use `await wait()` between bricks for smooth animations.

7. **Custom IDs**: You can assign custom IDs to bricks for easier tracking and querying:
   ```javascript
   createBrick({ id: 'foundation-1', position: { x: 0, y: 24, z: 0 } });
   const brick = findBrickById('foundation-1');
   ```

8. **Modern JavaScript**: You can use all modern JS features including arrow functions, template strings, destructuring, etc.

## LLM Response Format

**IMPORTANT**: When generating scripts, return ONLY the JavaScript code without markdown code fences, explanations, or comments (except brief inline comments). The code should be ready to execute directly.

Example of correct format:
```
clearScene();
createBrick({
  type: 'rectangle',
  color: '#ff0000',
  position: { x: 0, y: 24, z: 0 },
  dimensions: { x: 2, z: 2 }
});
```

Do NOT wrap in code fences like this:
```
\`\`\`javascript
// code here
\`\`\`
```
