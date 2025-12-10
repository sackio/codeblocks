# CodeBlocks JSON Structure

## Overview

CodeBlocks uses a JSON format to represent 3D brick scenes. This allows you to save, share, and load brick creations. Each scene contains an array of brick objects with precise position, color, size, and shape information.

## Complete Brick Object

```json
{
  "id": "unique-identifier",
  "color": {
    "r": 255,
    "g": 0,
    "b": 0,
    "a": 1
  },
  "position": {
    "x": 0,
    "y": 24,
    "z": 0
  },
  "dimensions": {
    "x": 2,
    "z": 4,
    "y": 1,
    "type": "rectangle"
  },
  "rotation": 0
}
```

## Field Descriptions

### id (string)
- Unique identifier for the brick
- Typically a UUID or auto-generated ID
- Used to reference the brick in scripts
- Example: `"brick-12345"` or `"a1b2c3d4-e5f6-7890"`

### color (object)
RGBA color values for the brick:
- **r**: Red value (0-255)
- **g**: Green value (0-255)
- **b**: Blue value (0-255)
- **a**: Alpha/opacity (0-1)
  - 0 = fully transparent
  - 1 = fully opaque

**Examples:**
```json
{ "r": 255, "g": 0, "b": 0, "a": 1 }      // Solid red
{ "r": 0, "g": 0, "b": 255, "a": 0.5 }    // Semi-transparent blue
{ "r": 255, "g": 255, "b": 255, "a": 1 }  // White
```

### position (object)
3D coordinates in world space:
- **x**: Horizontal position (left/right)
  - Negative = left
  - Positive = right
- **y**: Vertical position (height)
  - Ground level typically starts at y = 24
  - Each brick is ~33 units tall
- **z**: Depth position (forward/back)
  - Negative = back
  - Positive = front

**Coordinate System:**
- Origin (0, 0, 0) is at the center of the grid
- Units are in Three.js world space

**Examples:**
```json
{ "x": 0, "y": 24, "z": 0 }      // Ground level, center
{ "x": 50, "y": 57, "z": -25 }   // Second level, offset
{ "x": -100, "y": 90, "z": 100 } // Third level, corner
```

### dimensions (object)
Brick size and shape:
- **x**: Width in studs (1-8)
- **z**: Length in studs (1-8)
- **y**: Height multiplier (optional, default: 1)
  - 1 = standard brick height
  - 0.33 = plate height (1/3 standard)
  - 2 = double height
- **type**: Shape type (default: "rectangle")

**Measurement Conversion:**
- 1 stud = 25 Three.js units (base unit)
- Standard brick height = 33 units
- A 2x4 brick = 50 x 33 x 100 units (width x height x length)

### rotation (number)
- Rotation angle in radians (0 to 2π)
- Rotates around the Y-axis (vertical)
- **Common values:**
  - 0 = no rotation
  - π/2 (1.5708) = 90 degrees
  - π (3.1416) = 180 degrees
  - 3π/2 (4.7124) = 270 degrees

**Examples:**
```json
"rotation": 0                    // No rotation
"rotation": 1.5707963267948966   // 90 degrees (π/2)
"rotation": 3.141592653589793    // 180 degrees (π)
```

## Brick Types

Available shape types for the `dimensions.type` field:

### Basic Shapes
- **rectangle** - Standard rectangular brick (default)
- **plate** - Thin flat brick (1/3 height)
- **tile** - Smooth top surface, no studs

### Slopes
- **slope45** - 45-degree slope
- **slope33** - 33-degree slope (gentler)
- **slopeInverted** - Inverted/negative slope

### Corners
- **cornerInside** - Inside corner piece
- **cornerOutside** - Outside corner piece
- **cornerRound** - Rounded corner

### Special Shapes
- **curve** - Curved brick
- **cylinder** - Cylindrical brick
- **cone** - Cone-shaped brick
- **wedge** - Wedge-shaped brick

## Example JSON File

Complete example of a scene with multiple bricks:

```json
{
  "bricks": [
    {
      "id": "brick-001",
      "color": { "r": 255, "g": 0, "b": 0, "a": 1 },
      "position": { "x": 0, "y": 24, "z": 0 },
      "dimensions": { "x": 2, "z": 2, "type": "rectangle" },
      "rotation": 0
    },
    {
      "id": "brick-002",
      "color": { "r": 0, "g": 0, "b": 255, "a": 1 },
      "position": { "x": 0, "y": 57, "z": 0 },
      "dimensions": { "x": 2, "z": 2, "type": "rectangle" },
      "rotation": 0
    },
    {
      "id": "brick-003",
      "color": { "r": 0, "g": 255, "b": 0, "a": 1 },
      "position": { "x": 50, "y": 24, "z": 0 },
      "dimensions": { "x": 4, "z": 2, "type": "slope45" },
      "rotation": 1.5707963267948966
    },
    {
      "id": "brick-004",
      "color": { "r": 255, "g": 255, "b": 0, "a": 0.7 },
      "position": { "x": -50, "y": 24, "z": 50 },
      "dimensions": { "x": 1, "z": 1, "y": 3, "type": "cylinder" },
      "rotation": 0
    }
  ]
}
```

## Importing/Exporting

### Exporting Scenes

Use the File menu in the application to export your creation:
1. Click **File** → **Export**
2. Save the JSON file to your computer
3. Share with others or save for later

### Importing Scenes

Load a previously saved scene:
1. Click **File** → **Import**
2. Select a JSON file
3. The scene will load instantly

### Sample Models

Sample models are available in the `/examples` directory:
- `basic-wall.json` - Simple wall structure
- `simple-tower.json` - Vertical tower
- `house.json` - House with roof
- `dragon.json` - Complex dragon model

## JSON Validation

Common errors to avoid:

1. **Invalid color values**: RGB values must be 0-255, alpha must be 0-1
2. **Missing required fields**: id, color, position, dimensions are required
3. **Invalid rotation**: Must be a number in radians
4. **Invalid brick type**: Type must be one of the supported shapes
5. **Malformed JSON**: Check for missing commas, brackets, or quotes

## Scripting Integration

JSON files can be loaded programmatically:

```javascript
// Load from file
fetch('examples/house.json')
  .then(response => response.json())
  .then(data => {
    data.bricks.forEach(brickData => {
      createBrick({
        color: `rgba(${brickData.color.r}, ${brickData.color.g}, ${brickData.color.b}, ${brickData.color.a})`,
        position: brickData.position,
        dimensions: brickData.dimensions,
        rotation: brickData.rotation,
        id: brickData.id
      });
    });
  });
```

## See Also

- [Scripting API Reference](scripting-api.md) - Full API documentation
- [Examples](../app/utils/) - Example scripts organized by skill level
- [Deployment Guide](../DEPLOYMENT.md) - How to run CodeBlocks
