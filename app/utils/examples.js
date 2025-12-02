// Example scripts and JSON files for CodeBlocks

export const scriptExamples = {
  'spiral-tower': {
    name: 'Spiral Tower',
    description: 'Colorful tower with rotating bricks',
    code: `// Spiral Tower
// Creates a colorful tower with rotating bricks

const colors = ['#ff0000', '#ff7700', '#ffdd00', '#00ff00', '#0088ff', '#0000ff', '#8800ff'];
const levels = 15;
const rotationStep = Math.PI / 8;

for (let i = 0; i < levels; i++) {
  const color = colors[i % colors.length];
  const rotation = i * rotationStep;

  createBrick({
    type: 'rectangle',
    color: color,
    position: { x: 0, y: i * 24, z: 0 },
    rotation: rotation,
    dimensions: { x: 3, z: 1 }
  });

  await wait(200);
}`
  },

  'castle': {
    name: 'Castle',
    description: 'Small castle with towers',
    code: `// Simple Castle
// Builds a small castle with towers

const wallColor = '#888888';
const towerColor = '#666666';
const roofColor = '#cc3333';
const spacing = 25;

// Build four corner towers
const towers = [
  { x: 0, z: 0 },
  { x: 0, z: 150 },
  { x: 150, z: 0 },
  { x: 150, z: 150 }
];

for (const tower of towers) {
  // Tower base
  for (let y = 0; y < 8; y++) {
    createBrick({
      type: 'rectangle',
      color: towerColor,
      position: { x: tower.x, y: y * 24, z: tower.z },
      dimensions: { x: 2, z: 2 }
    });
    await wait(15);
  }

  // Tower roof
  createBrick({
    type: 'cone',
    color: roofColor,
    position: { x: tower.x, y: 8 * 24, z: tower.z },
    dimensions: { x: 3, z: 3 }
  });
  await wait(50);
}

// Build walls between towers
const walls = [
  { start: [0, 0], end: [0, 150], axis: 'z' },
  { start: [0, 0], end: [150, 0], axis: 'x' },
  { start: [150, 0], end: [150, 150], axis: 'z' },
  { start: [0, 150], end: [150, 150], axis: 'x' }
];

for (const wall of walls) {
  const isZAxis = wall.axis === 'z';
  const start = isZAxis ? wall.start[1] : wall.start[0];
  const end = isZAxis ? wall.end[1] : wall.end[0];
  const fixed = isZAxis ? wall.start[0] : wall.start[1];

  for (let pos = start + spacing; pos < end; pos += spacing) {
    for (let y = 0; y < 5; y++) {
      createBrick({
        type: 'rectangle',
        color: wallColor,
        position: {
          x: isZAxis ? fixed : pos,
          y: y * 24,
          z: isZAxis ? pos : fixed
        },
        dimensions: { x: 2, z: 2 }
      });
      await wait(10);
    }
  }
}`
  },

  'pyramid': {
    name: 'Pyramid',
    description: 'Classic pyramid structure',
    code: `// Pyramid
// Builds a classic pyramid structure

const baseSize = 7;
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
}`
  },

  'rainbow-wall': {
    name: 'Rainbow Wall',
    description: 'Vertical rainbow wall',
    code: `// Rainbow Wall
// Creates a vertical rainbow wall

const colors = [
  '#ff0000', '#ff3300', '#ff6600', '#ff9900', '#ffcc00', '#ffff00',
  '#ccff00', '#99ff00', '#66ff00', '#33ff00', '#00ff00', '#00ff33',
  '#00ff66', '#00ff99', '#00ffcc', '#00ffff', '#00ccff', '#0099ff',
  '#0066ff', '#0033ff', '#0000ff', '#3300ff', '#6600ff', '#9900ff'
];

const height = 8;
const spacing = 25;

for (let x = 0; x < colors.length; x++) {
  for (let y = 0; y < height; y++) {
    createBrick({
      type: 'rectangle',
      color: colors[x],
      position: {
        x: x * spacing,
        y: y * 24,
        z: 0
      },
      dimensions: { x: 2, z: 2 }
    });
    await wait(20);
  }
}`
  },

  'checkerboard': {
    name: 'Checkerboard',
    description: 'Alternating checkerboard pattern',
    code: `// Checkerboard Pattern
// Creates an alternating checkerboard

const size = 8;
const spacing = 25;
const color1 = '#ffffff';
const color2 = '#000000';

for (let x = 0; x < size; x++) {
  for (let z = 0; z < size; z++) {
    const isEven = (x + z) % 2 === 0;
    const color = isEven ? color1 : color2;

    createBrick({
      type: 'plate',
      color: color,
      position: {
        x: x * spacing,
        y: 12,
        z: z * spacing
      },
      dimensions: { x: 2, z: 2 }
    });
    await wait(40);
  }
}`
  },

  'wave': {
    name: 'Wave Effect',
    description: 'Animated wave using cylinders',
    code: `// Wave Effect
// Creates an animated wave using cylinders

const width = 12;
const depth = 8;
const spacing = 25;
const baseColor = '#00aaff';

for (let x = 0; x < width; x++) {
  for (let z = 0; z < depth; z++) {
    const height = Math.sin((x + z) / 2) * 3 + 4;
    const brightness = Math.floor(155 + Math.sin((x + z) / 2) * 100);
    const color = \`#00\${brightness.toString(16)}ff\`;

    createBrick({
      type: 'cylinder',
      color: color,
      position: {
        x: x * spacing,
        y: height * 12,
        z: z * spacing
      },
      dimensions: { x: 2, z: 2 }
    });
    await wait(25);
  }
}`
  },

  'shapes-showcase': {
    name: 'Shapes Showcase',
    description: 'Display all available brick shapes',
    code: `// Shapes Showcase
// Displays all available brick shapes

const shapes = [
  'rectangle', 'cylinder', 'cone', 'slope45', 'slope33',
  'slopeInverted', 'wedge', 'arch', 'curve', 'cornerInside',
  'cornerOutside', 'cornerRound', 'plate', 'tile'
];

const colors = [
  '#ff0000', '#ff7700', '#ffdd00', '#00ff00', '#0088ff',
  '#0000ff', '#8800ff', '#ff0088', '#ff6b35', '#33cc33',
  '#3399ff', '#cc33cc', '#ffaa00', '#00cccc'
];

const spacing = 50;

for (let i = 0; i < shapes.length; i++) {
  const x = (i % 5) * spacing;
  const z = Math.floor(i / 5) * spacing;

  createBrick({
    type: shapes[i],
    color: colors[i % colors.length],
    position: { x, y: 24, z },
    dimensions: { x: 2, z: 2 }
  });

  await wait(150);
}`
  }
};

export const examplesList = Object.keys(scriptExamples).map(key => ({
  id: key,
  ...scriptExamples[key]
}));
