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
    position: { x: 0, y: i * 33, z: 0 },
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
const spacing = 50;

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
      position: { x: tower.x, y: y * 33, z: tower.z },
      dimensions: { x: 2, z: 2 }
    });
    await wait(15);
  }

  // Tower roof
  createBrick({
    type: 'cone',
    color: roofColor,
    position: { x: tower.x, y: 8 * 33, z: tower.z },
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
          y: y * 33,
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
const brickSpacing = 50;
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
          y: level * 33,
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
const spacing = 50;

for (let x = 0; x < colors.length; x++) {
  for (let y = 0; y < height; y++) {
    createBrick({
      type: 'rectangle',
      color: colors[x],
      position: {
        x: x * spacing,
        y: y * 33,
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
const spacing = 50;
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
const spacing = 50;
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

const spacing = 75;

for (let i = 0; i < shapes.length; i++) {
  const x = (i % 5) * spacing;
  const z = Math.floor(i / 5) * spacing;

  createBrick({
    type: shapes[i],
    color: colors[i % colors.length],
    position: { x, y: 12, z },
    dimensions: { x: 2, z: 2 }
  });

  await wait(150);
}`
  },

  'oop-dancing-brick': {
    name: 'OOP: Dancing Brick',
    description: 'Learn method chaining with a dancing brick!',
    code: `// Dancing Brick (OOP Style!)
// Watch this brick move and change colors!

const dancer = createBrick({
  type: 'rectangle',
  color: 'red',
  position: { x: 0, y: 12, z: 0 }
});

// Chain methods together!
await dancer
  .wait(500)
  .color('blue')
  .wait(300)
  .moveBy({ x: 50 })
  .wait(300)
  .color('green')
  .wait(300)
  .moveBy({ z: 50 })
  .wait(300)
  .color('yellow')
  .wait(300)
  .moveBy({ x: -50 })
  .wait(300)
  .color('purple')
  .wait(300)
  .moveBy({ z: -50 })
  .wait(300)
  .color('orange');`
  },

  'oop-rainbow-tower': {
    name: 'OOP: Rainbow Tower',
    description: 'Build and animate a tower with OOP style',
    code: `// Rainbow Tower (OOP Style!)
// Build a tower and animate it!

const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
const bricks = [];

// Build the tower
for (let i = 0; i < 6; i++) {
  const brick = createBrick({
    color: colors[i],
    position: { x: 0, y: i * 33, z: 0 },
    dimensions: { x: 2, z: 2 }
  });
  bricks.push(brick);
  await wait(200);
}

// Animate each brick!
for (const brick of bricks) {
  await brick
    .moveBy({ x: 25 })
    .wait(100)
    .color('#ffffff')
    .wait(100)
    .moveBy({ x: -25 })
    .wait(100);
}

// Make them all spin!
for (const brick of bricks) {
  await brick.rotate(Math.PI / 4).wait(50);
}`
  },

  'oop-grid-animation': {
    name: 'OOP: Grid Animation',
    description: 'Use OOP to animate a grid',
    code: `// Animated Grid (OOP Style!)
// Create a grid and make it come alive!

const grid = await createGrid(5, 5, {
  color: '#888888',
  type: 'plate',
  animate: true,
  delay: 30
});

await wait(500);

// Wave animation using OOP!
for (let i = 0; i < grid.length; i++) {
  const row = Math.floor(i / 5);
  const col = i % 5;
  const delay = (row + col) * 100;

  // Each brick animates independently
  setTimeout(async () => {
    await grid[i]
      .color('#ff6b35')
      .wait(200)
      .moveBy({ y: 12 })
      .wait(200)
      .color('#00aaff')
      .wait(200)
      .moveBy({ y: -12 })
      .wait(200)
      .color('#888888');
  }, delay);
}

await wait(3000);`
  },

  'oop-color-cycle': {
    name: 'OOP: Color Cycle',
    description: 'Watch bricks cycle through colors',
    code: `// Color Cycling (OOP + Functional Mix!)
// Mix both programming styles!

const colors = ['#ff0000', '#ff7700', '#ffdd00', '#00ff00', '#0088ff', '#8800ff'];

// Create bricks using functional style
for (let i = 0; i < 5; i++) {
  createBrick({
    color: colors[0],
    position: { x: i * 50, y: 12, z: 0 }
  });
  await wait(100);
}

// Animate using OOP style!
for (let cycle = 0; cycle < 3; cycle++) {
  for (let i = 0; i < 5; i++) {
    const brickId = getBrickId(i);
    const b = brick(brickId);

    for (const color of colors) {
      await b.color(color).wait(200);
    }
  }
}

// Final rainbow!
for (let i = 0; i < 5; i++) {
  brick(getBrickId(i)).color(colors[i]);
}`
  },

  'camera-tour': {
    name: 'Camera Tour',
    description: 'Build a tower with a camera tour!',
    code: `// Camera Tour Demo
// Build a colorful tower and take a tour around it!

const colors = ['#ff0000', '#ff7700', '#ffdd00', '#00ff00', '#0088ff', '#8800ff'];

// Build a rainbow tower
for (let i = 0; i < 6; i++) {
  createBrick({
    color: colors[i],
    position: { x: 0, y: i * 33, z: 0 },
    dimensions: { x: 3, z: 3 }
  });
  await wait(200);
}

await wait(500);

// Now take a tour around it!
await setTopView();
await wait(1000);

await setFrontView();
await wait(1000);

await setSideView();
await wait(1000);

await setIsometricView();
await wait(500);

// Zoom in for a closer look
for (let i = 0; i < 3; i++) {
  await zoomIn();
  await wait(200);
}

await wait(500);

// Zoom back out
for (let i = 0; i < 3; i++) {
  await zoomOut();
  await wait(200);
}

// Return to normal view
await resetView();`
  },

  'motion-tracking': {
    name: 'Motion Tracking Camera',
    description: 'Camera follows a moving brick like a movie!',
    code: `// Motion Tracking Demo
// Watch the camera follow a brick around the scene!

// Create our star brick
const hero = createBrick({
  type: 'cylinder',
  color: '#ff6b35',
  position: { x: 0, y: 12, z: 0 },
  dimensions: { x: 2, z: 2 }
});

await wait(500);

// Position camera to start tracking
await setCameraView(
  { x: 300, y: 200, z: 300 },
  { x: 0, y: 12, z: 0 }
);

await wait(500);

// Move forward while camera tracks
for (let i = 0; i < 8; i++) {
  await hero.moveBy({ z: 25 });
  const pos = hero.getPosition();

  // Camera follows from behind and above
  await setCameraView(
    { x: pos.x, y: pos.y + 150, z: pos.z - 200 },
    { x: pos.x, y: pos.y, z: pos.z }
  );

  await wait(300);
}

await wait(500);

// Turn and camera moves to side view
for (let i = 0; i < 8; i++) {
  await hero.moveBy({ x: 25 });
  const pos = hero.getPosition();

  // Camera tracks from the side
  await setCameraView(
    { x: pos.x, y: pos.y + 150, z: pos.z + 200 },
    { x: pos.x, y: pos.y, z: pos.z }
  );

  await wait(300);
}

await wait(500);

// Circle around the brick!
const finalPos = hero.getPosition();
for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 12) {
  const radius = 250;
  const camX = finalPos.x + Math.cos(angle) * radius;
  const camZ = finalPos.z + Math.sin(angle) * radius;

  await setCameraView(
    { x: camX, y: finalPos.y + 150, z: camZ },
    { x: finalPos.x, y: finalPos.y, z: finalPos.z }
  );

  await wait(100);
}

await wait(500);
await resetView();`
  },

  'cinematic-path': {
    name: 'Cinematic Camera Path',
    description: 'Create a smooth camera flight path',
    code: `// Cinematic Camera Path
// Build a scene and fly the camera through it!

// Build a simple structure
const colors = ['#ff0000', '#ff7700', '#ffdd00', '#00ff00', '#0088ff'];
for (let i = 0; i < 5; i++) {
  createBrick({
    color: colors[i],
    position: { x: i * 50, y: 12, z: 0 },
    dimensions: { x: 2, z: 2 }
  });

  createBrick({
    color: colors[i],
    position: { x: i * 50, y: 45, z: 0 },
    dimensions: { x: 2, z: 2 }
  });

  await wait(100);
}

await wait(1000);

// Define camera path keyframes
const keyframes = [
  { pos: { x: -200, y: 50, z: 200 }, target: { x: 0, y: 20, z: 0 } },
  { pos: { x: 100, y: 100, z: 300 }, target: { x: 100, y: 20, z: 0 } },
  { pos: { x: 200, y: 200, z: 200 }, target: { x: 150, y: 20, z: 0 } },
  { pos: { x: 400, y: 150, z: -100 }, target: { x: 200, y: 20, z: 0 } },
  { pos: { x: 300, y: 250, z: -200 }, target: { x: 100, y: 20, z: 0 } },
  { pos: { x: 100, y: 300, z: 0 }, target: { x: 100, y: 20, z: 0 } }
];

// Fly through each keyframe
for (const frame of keyframes) {
  await setCameraView(frame.pos, frame.target);
  await wait(800);
}

await wait(1000);
await resetView();`
  }
};

export const examplesList = Object.keys(scriptExamples).map(key => ({
  id: key,
  ...scriptExamples[key]
}));
