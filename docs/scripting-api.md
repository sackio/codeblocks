# CodeBlocks Scripting API

## Functions

### `createBrick(options)`
Creates a new brick in the scene.

**Parameters:**
- `color` (string|object): Color as CSS color string or RGBA object {r, g, b, a}
- `position` (object): {x, y, z} coordinates in 3D space
- `dimensions` (object): {x, z, type} or {x, y, z, type} for custom dimensions
  - `x`: Width (studs)
  - `y`: Height (optional, uses default if not specified)
  - `z`: Length (studs)
  - `type`: Shape type (rectangle, slope45, cylinder, etc.)

**Returns:** Brick object

### `wait(milliseconds)`
Pauses script execution for the specified duration.

**Parameters:**
- `milliseconds` (number): Duration to wait

**Returns:** Promise

### `removeBrick(brick)`
Removes a brick from the scene.

**Parameters:**
- `brick` (object): Brick object to remove
