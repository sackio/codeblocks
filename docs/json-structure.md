# CodeBlocks JSON Structure

## Brick Object Structure

Each brick in the scene is represented by a JSON object with the following properties:

```json
{
  "uuid": "unique-identifier",
  "color": {
    "r": 255,
    "g": 0,
    "b": 0,
    "a": 1
  },
  "position": {
    "x": 0,
    "y": 0,
    "z": 0
  },
  "dimensions": {
    "x": 2,
    "y": 1,
    "z": 4,
    "type": "rectangle"
  }
}
```

## Color Object
- `r`: Red value (0-255)
- `g`: Green value (0-255)
- `b`: Blue value (0-255)
- `a`: Alpha/opacity (0-1)

## Position Object
- `x`: X coordinate in 3D space
- `y`: Y coordinate (height)
- `z`: Z coordinate in 3D space

## Dimensions Object
- `x`: Width in studs
- `y`: Height (optional, defaults to standard brick height)
- `z`: Length in studs
- `type`: Shape type (rectangle, slope45, cylinder, etc.)
