export const base = 25;


// Shape types available for bricks
export const shapeTypes = {
  RECTANGLE: 'rectangle',
  SLOPE_45: 'slope45',
  SLOPE_33: 'slope33',
  SLOPE_INVERTED: 'slopeInverted',
  CORNER_INSIDE: 'cornerInside',
  CORNER_OUTSIDE: 'cornerOutside',
  CORNER_ROUND: 'cornerRound',
  CURVE: 'curve',
  ARCH: 'arch',
  CYLINDER: 'cylinder',
  CONE: 'cone',
  WEDGE: 'wedge',
  PLATE: 'plate',
  TILE: 'tile',
};

export const bricks = [
  { x: 1, z: 1, type: 'rectangle' },
  { x: 2, z: 1, type: 'rectangle' },
  { x: 2, z: 2, type: 'rectangle' },
  { x: 3, z: 1, type: 'rectangle' },
  { x: 3, z: 2, type: 'rectangle' },
  { x: 4, z: 1, type: 'rectangle' },
  { x: 4, z: 2, type: 'rectangle' },
];


export const colors = [
  { r: 255, g: 0, b: 0, a: 1 },     // Red
  { r: 255, g: 152, b: 0, a: 1 },   // Orange
  { r: 240, g: 225, b: 0, a: 1 },   // Yellow
  { r: 0, g: 222, b: 0, a: 1 },     // Green
  { r: 161, g: 188, b: 36, a: 1 },  // Olive Green
  { r: 0, g: 17, b: 207, a: 1 },    // Blue
  { r: 255, g: 255, b: 255, a: 1 }, // White
  { r: 0, g: 0, b: 0, a: 1 },       // Black
  { r: 101, g: 42, b: 12, a: 1 }    // Brown
];
