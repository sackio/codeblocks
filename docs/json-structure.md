# CodeBlocks JSON Structure Reference

## Overview
CodeBlocks scenes can be represented as JSON files containing an array of brick objects. This format allows for easy saving, loading, and manual editing of scenes.

## Root Structure

```json
{
  "bricks": [
    // Array of brick objects
  ]
}
```

## Brick Object Schema

Each brick in the `bricks` array has the following structure:

```json
{
  "id": "unique-uuid-string",
  "position": {
    "x": 0,
    "y": 25,
    "z": 0
  },
  "color": {
    "r": 255,
    "g": 0,
    "b": 0,
    "a": 1
  },
  "dimensions": {
    "x": 2,
    "z": 4,
    "type": "rectangle"
  },
  "rotation": 0
}
```

## Field Descriptions

### id (string, required)
Unique identifier for the brick. Typically a UUID format string.
- Example: `"a1b2c3d4-e5f6-7890-abcd-ef1234567890"`

### position (object, required)
3D coordinates of the brick's position.

**Fields:**
- `x` (number): Horizontal position (left-right)
- `y` (number): Vertical position (height)
- `z` (number): Depth position (front-back)

**Units:** Multiples of 25 (base brick size)
- Example: `{"x": 0, "y": 25, "z": 0}` places a brick at origin, one unit high

### color (object, required)
RGBA color values for the brick.

**Fields:**
- `r` (number): Red channel (0-255)
- `g` (number): Green channel (0-255)
- `b` (number): Blue channel (0-255)
- `a` (number): Alpha/opacity (0-1, where 1 is fully opaque)

**Examples:**
```json
{"r": 255, "g": 0, "b": 0, "a": 1}     // Opaque red
{"r": 0, "g": 255, "b": 0, "a": 0.5}   // Semi-transparent green
{"r": 100, "g": 100, "b": 255, "a": 1} // Light blue
```

### dimensions (object, required)
Size and shape of the brick.

**Fields:**
- `x` (number): Width in studs
- `z` (number): Length in studs
- `type` (string): Brick type/shape

**Common dimensions:**
- `{"x": 2, "z": 4, "type": "rectangle"}` - Standard 2x4 brick
- `{"x": 2, "z": 2, "type": "rectangle"}` - 2x2 brick
- `{"x": 1, "z": 2, "type": "plate"}` - 1x2 plate (thinner)

### rotation (number, required)
Rotation of the brick in radians.

**Common values:**
- `0` - No rotation
- `1.5707963267948966` (π/2) - 90° clockwise
- `3.141592653589793` (π) - 180°
- `4.71238898038469` (3π/2) - 270° clockwise

## Brick Types

Available type values:
- `rectangle` - Standard rectangular brick
- `slope45` - 45-degree slope
- `slope33` - 33-degree slope
- `slopeInverted` - Inverted slope
- `cornerInside` - Inside corner piece
- `cornerOutside` - Outside corner piece
- `cornerRound` - Rounded corner
- `curve` - Curved piece
- `cylinder` - Cylindrical piece
- `cone` - Cone-shaped piece
- `wedge` - Wedge-shaped piece
- `plate` - Thin plate (1/3 height)
- `tile` - Smooth tile (no studs)

## Example Scenes

### Simple Tower
```json
{
  "bricks": [
    {
      "id": "brick-1",
      "position": {"x": 0, "y": 25, "z": 0},
      "color": {"r": 255, "g": 0, "b": 0, "a": 1},
      "dimensions": {"x": 2, "z": 4, "type": "rectangle"},
      "rotation": 0
    },
    {
      "id": "brick-2",
      "position": {"x": 0, "y": 50, "z": 0},
      "color": {"r": 0, "g": 255, "b": 0, "a": 1},
      "dimensions": {"x": 2, "z": 4, "type": "rectangle"},
      "rotation": 0
    },
    {
      "id": "brick-3",
      "position": {"x": 0, "y": 75, "z": 0},
      "color": {"r": 0, "g": 0, "b": 255, "a": 1},
      "dimensions": {"x": 2, "z": 4, "type": "rectangle"},
      "rotation": 0
    }
  ]
}
```

### Wall with Window
```json
{
  "bricks": [
    {
      "id": "wall-left",
      "position": {"x": 0, "y": 25, "z": 0},
      "color": {"r": 139, "g": 69, "b": 19, "a": 1},
      "dimensions": {"x": 2, "z": 8, "type": "rectangle"},
      "rotation": 0
    },
    {
      "id": "wall-right",
      "position": {"x": 200, "y": 25, "z": 0},
      "color": {"r": 139, "g": 69, "b": 19, "a": 1},
      "dimensions": {"x": 2, "z": 8, "type": "rectangle"},
      "rotation": 0
    },
    {
      "id": "window-top",
      "position": {"x": 100, "y": 75, "z": 0},
      "color": {"r": 139, "g": 69, "b": 19, "a": 1},
      "dimensions": {"x": 2, "z": 4, "type": "rectangle"},
      "rotation": 0
    }
  ]
}
```

### Rainbow Line
```json
{
  "bricks": [
    {
      "id": "red",
      "position": {"x": 0, "y": 25, "z": 0},
      "color": {"r": 255, "g": 0, "b": 0, "a": 1},
      "dimensions": {"x": 2, "z": 2, "type": "rectangle"},
      "rotation": 0
    },
    {
      "id": "orange",
      "position": {"x": 50, "y": 25, "z": 0},
      "color": {"r": 255, "g": 127, "b": 0, "a": 1},
      "dimensions": {"x": 2, "z": 2, "type": "rectangle"},
      "rotation": 0
    },
    {
      "id": "yellow",
      "position": {"x": 100, "y": 25, "z": 0},
      "color": {"r": 255, "g": 255, "b": 0, "a": 1},
      "dimensions": {"x": 2, "z": 2, "type": "rectangle"},
      "rotation": 0
    },
    {
      "id": "green",
      "position": {"x": 150, "y": 25, "z": 0},
      "color": {"r": 0, "g": 255, "b": 0, "a": 1},
      "dimensions": {"x": 2, "z": 2, "type": "rectangle"},
      "rotation": 0
    },
    {
      "id": "blue",
      "position": {"x": 200, "y": 25, "z": 0},
      "color": {"r": 0, "g": 0, "b": 255, "a": 1},
      "dimensions": {"x": 2, "z": 2, "type": "rectangle"},
      "rotation": 0
    }
  ]
}
```

## Position Guidelines

- **Ground Level**: y = 25 (first layer)
- **Stacking**: Add 25 for each layer up (y = 50, 75, 100, etc.)
- **Horizontal Spacing**: Use multiples of 25 for neat alignment
- **Grid Positioning**: x and z typically in multiples of 25 or 50

## Color Palettes

### Primary Colors
```json
{"r": 255, "g": 0, "b": 0, "a": 1}   // Red
{"r": 0, "g": 255, "b": 0, "a": 1}   // Green
{"r": 0, "g": 0, "b": 255, "a": 1}   // Blue
```

### Classic LEGO Colors
```json
{"r": 196, "g": 0, "b": 38, "a": 1}    // LEGO Red
{"r": 247, "g": 194, "b": 0, "a": 1}   // LEGO Yellow
{"r": 0, "g": 143, "b": 211, "a": 1}   // LEGO Blue
{"r": 89, "g": 93, "b": 96, "a": 1}    // LEGO Gray
```

### Pastels
```json
{"r": 255, "g": 182, "b": 193, "a": 1} // Light Pink
{"r": 173, "g": 216, "b": 230, "a": 1} // Light Blue
{"r": 144, "g": 238, "b": 144, "a": 1} // Light Green
```

## Best Practices

1. **IDs**: Use unique, descriptive IDs or generate UUIDs
2. **Positioning**: Stick to multiples of 25 for clean alignment
3. **Colors**: Keep alpha at 1 unless transparency is needed
4. **Organization**: Group related bricks together in the array
5. **Validation**: Ensure all required fields are present
6. **Readability**: Use proper JSON formatting with indentation

## LLM Response Format

When generating JSON, return ONLY valid JSON without markdown code fences or explanations. The JSON should be properly formatted and ready to parse.
