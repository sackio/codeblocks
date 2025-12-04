# CodeBlocks Quick Reference Guide

## Essential Commands

### Creating Bricks
```javascript
createBrick({
  type: 'rectangle',           // Brick type (optional, default: 'rectangle')
  color: '#ff0000',            // Hex color (optional, default: '#ff6b35')
  position: { x: 0, y: 24, z: 0 }, // Position (optional, default: {x:0, y:12, z:0})
  rotation: 0,                 // Rotation in radians (optional, default: 0)
  dimensions: { x: 2, z: 2 },  // Size in studs (optional, default: {x:2, z:2})
  id: 'my-brick',             // Custom ID (optional, default: auto-generated)
  render: true                 // Add to scene immediately (optional, default: true)
});
```

### Scene Control
```javascript
clearScene();                  // Remove all bricks
```

### Timing & Animation
```javascript
await wait(500);              // Pause for 500 milliseconds
```

### Camera Views
```javascript
setTopView();                 // View from above
setFrontView();               // View from front
setSideView();                // View from side
setIsometricView();           // 3D isometric view (default)
resetView();                  // Reset to isometric
```

## Collision Detection & Positioning

### Helper Constants
```javascript
BRICK_HEIGHT   // 24 - Standard brick height
BRICK_SPACING  // 25 - Recommended spacing between bricks
STUD_SIZE      // 10 - Size of a single stud
```

### Position Checking
```javascript
isPositionOccupied(position, tolerance)
// Check if position is occupied
// Returns: boolean

getNextFreePosition(startPos, spacing, maxSearch)
// Find next unoccupied position
// Returns: {x, y, z} or null

snapToGrid(position, gridSize)
// Align position to grid
// Returns: {x, y, z}
```

### Query Functions
```javascript
getBrickCount()
// Get total number of bricks
// Returns: number

findBricksAt(position, tolerance)
// Find bricks at position
// Returns: array of brick IDs

findBricksByColor(color)
// Find all bricks of a color
// Returns: array of brick IDs

findBrickById(id)
// Find brick by custom ID
// Returns: brick ID or null
```

### Batch Operations
```javascript
createBricks(arrayOfOptions)
// Create multiple bricks at once
// Returns: array of BrickAPI objects

deleteBricks(arrayOfBrickIds)
// Delete multiple bricks at once
```

## Brick Types

| Type | Description |
|------|-------------|
| `'rectangle'` | Standard rectangular brick (default) |
| `'cylinder'` | Round cylindrical piece |
| `'cone'` | Cone-shaped piece |
| `'slope45'` | 45-degree slope |
| `'slope33'` | 33-degree slope (gentler) |
| `'slopeInverted'` | Upside-down slope |
| `'wedge'` | Triangular wedge piece |
| `'cornerInside'` | Inside corner piece |
| `'cornerOutside'` | Outside corner piece |
| `'cornerRound'` | Rounded corner |
| `'curve'` | Curved piece |
| `'arch'` | Arch-shaped piece |
| `'plate'` | Thin flat plate (1/3 height) |
| `'tile'` | Smooth tile (no studs) |

## Common Colors

| Color | Hex Code |
|-------|----------|
| Red | `'#ff0000'` |
| Orange | `'#ff6b35'` |
| Yellow | `'#ffff00'` |
| Green | `'#00ff00'` |
| Blue | `'#0000ff'` |
| Purple | `'#8800ff'` |
| Pink | `'#ff69b4'` |
| White | `'#ffffff'` |
| Black | `'#000000'` |
| Brown | `'#8B4513'` |

## Common Patterns

### Stack Bricks Vertically
```javascript
for (let i = 0; i < 10; i++) {
  createBrick({
    position: { x: 0, y: i * BRICK_HEIGHT, z: 0 }
  });
}
```

### Place Bricks in a Row
```javascript
for (let i = 0; i < 10; i++) {
  createBrick({
    position: { x: i * BRICK_SPACING, y: 24, z: 0 }
  });
}
```

### Create Grid Pattern
```javascript
for (let x = 0; x < 5; x++) {
  for (let z = 0; z < 5; z++) {
    createBrick({
      position: {
        x: x * BRICK_SPACING,
        y: 24,
        z: z * BRICK_SPACING
      }
    });
  }
}
```

### Prevent Overlapping
```javascript
for (let i = 0; i < 20; i++) {
  const pos = getNextFreePosition();
  if (pos) {
    createBrick({ position: pos });
  }
}
```

### Animated Building
```javascript
for (let i = 0; i < 10; i++) {
  createBrick({
    position: { x: 0, y: i * BRICK_HEIGHT, z: 0 }
  });
  await wait(200); // Pause between bricks
}
```

## Rotation Reference

| Degrees | Radians |
|---------|---------|
| 45° | `Math.PI / 4` |
| 90° | `Math.PI / 2` |
| 180° | `Math.PI` |
| 270° | `Math.PI * 1.5` |
| 360° | `Math.PI * 2` |

## Position Units

- **X-axis**: Left/Right (negative = left, positive = right)
- **Y-axis**: Up/Down (0 = ground, higher = up)
- **Z-axis**: Forward/Back (negative = back, positive = forward)

**Standard Units:**
- Brick height: 24 units
- Good spacing: 25-50 units for X and Z
- Origin (0, 0, 0) is center at ground level

## Best Practices

1. ✅ Always use `clearScene()` at the start of scripts
2. ✅ Use `await wait()` for smooth animations
3. ✅ Check positions with `isPositionOccupied()` to prevent overlaps
4. ✅ Use constants like `BRICK_HEIGHT` instead of magic numbers
5. ✅ Use `getNextFreePosition()` for automatic non-overlapping placement
6. ✅ Use descriptive variable names and comments
7. ✅ Test with small numbers before scaling up
8. ✅ Use `snapToGrid()` to ensure proper alignment

## Common Mistakes

❌ **Forgetting `await` with `wait()`**
```javascript
wait(500); // Wrong - won't pause
await wait(500); // Correct
```

❌ **Not checking for overlapping bricks**
```javascript
// Wrong - might overlap
createBrick({ position: { x: 0, y: 24, z: 0 } });
createBrick({ position: { x: 0, y: 24, z: 0 } });

// Correct - check first
const pos = { x: 0, y: 24, z: 0 };
if (!isPositionOccupied(pos)) {
  createBrick({ position: pos });
}
```

❌ **Using degrees instead of radians**
```javascript
rotation: 90 // Wrong - this is 90 radians, not degrees
rotation: Math.PI / 2 // Correct - 90 degrees
```

## Keyboard Shortcuts

*(If you're using the Script Editor)*

- **Ctrl/Cmd + Enter**: Run script
- **Ctrl/Cmd + S**: Save script
- **Tab**: Indent code

## Example: Complete Build Script

```javascript
clearScene();

// Build a simple tower with different brick types
const colors = ['#ff0000', '#ff7700', '#ffff00', '#00ff00'];
const types = ['rectangle', 'cylinder', 'cone', 'slope45'];

for (let i = 0; i < 10; i++) {
  const pos = getNextFreePosition();

  if (pos) {
    createBrick({
      type: types[i % types.length],
      color: colors[i % colors.length],
      position: pos,
      id: `brick-${i}`
    });
    await wait(150);
  }
}

// Switch to top view to see the pattern
setTopView();
await wait(1000);
setIsometricView();
```

## Need More Help?

- **Detailed Tutorial**: See `tutorial-for-kids.md`
- **Full API Reference**: See `scripting-api.md`
- **JSON Structure**: See `json-structure.md`
- **Questions?** Try the AI Helper in the Script Editor!
