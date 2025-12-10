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
    description: 'Learn animation chaining with a dancing brick!',
    code: `// Dancing Brick - v2.0 API
// Watch this brick move and change colors!

const dancerId = createBrick({
  type: 'rectangle',
  color: 'red',
  position: { x: 0, y: 12, z: 0 }
});

if (!dancerId) {
  console.error("Failed to create brick - collision detected");
  return;
}

// Chain animations together using animate()!
await animate(dancerId)
  .wait(500)
  .color('blue')
  .wait(300)
  .moveBy({ x: 50, y: 0, z: 0 })
  .wait(300)
  .color('green')
  .wait(300)
  .moveBy({ x: 0, y: 0, z: 50 })
  .wait(300)
  .color('yellow')
  .wait(300)
  .moveBy({ x: -50, y: 0, z: 0 })
  .wait(300)
  .color('purple')
  .wait(300)
  .moveBy({ x: 0, y: 0, z: -50 })
  .wait(300)
  .color('orange')
  .run();`
  },

  'oop-rainbow-tower': {
    name: 'OOP: Rainbow Tower',
    description: 'Build and animate a tower - v2.0 API',
    code: `// Rainbow Tower - v2.0 API
// Build a tower and animate it!

const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
const brickIds = [];

// Build the tower
for (let i = 0; i < 6; i++) {
  const brickId = createBrick({
    color: colors[i],
    position: { x: 0, y: i * 33, z: 0 },
    dimensions: { x: 2, z: 2 }
  });

  if (brickId) {
    brickIds.push(brickId);
  }
  await wait(200);
}

// Animate each brick using animate()!
for (const brickId of brickIds) {
  await animate(brickId)
    .moveBy({ x: 25, y: 0, z: 0 })
    .wait(100)
    .color('#ffffff')
    .wait(100)
    .moveBy({ x: -25, y: 0, z: 0 })
    .wait(100)
    .run();
}

// Make them all spin!
for (const brickId of brickIds) {
  await animate(brickId)
    .rotate(Math.PI / 4)
    .wait(50)
    .run();
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
    description: 'Camera follows a moving brick like a movie - v2.0 API!',
    code: `// Motion Tracking Demo - v2.0 API
// Watch the camera follow a brick around the scene!

// Create our star brick
const heroId = createBrick({
  type: 'cylinder',
  color: '#ff6b35',
  position: { x: 0, y: 12, z: 0 },
  dimensions: { x: 2, z: 2 }
});

if (!heroId) {
  console.error("Failed to create hero brick");
  return;
}

await wait(500);

// Position camera to start tracking
await setCameraView(
  { x: 300, y: 200, z: 300 },
  { x: 0, y: 12, z: 0 }
);

await wait(500);

// Move forward while camera tracks
for (let i = 0; i < 8; i++) {
  await animate(heroId).moveBy({ x: 0, y: 0, z: 25 }).run();

  const heroInfo = brick(heroId);
  if (!heroInfo) break;
  const pos = heroInfo.position;

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
  await animate(heroId).moveBy({ x: 25, y: 0, z: 0 }).run();

  const heroInfo = brick(heroId);
  if (!heroInfo) break;
  const pos = heroInfo.position;

  // Camera tracks from the side
  await setCameraView(
    { x: pos.x, y: pos.y + 150, z: pos.z + 200 },
    { x: pos.x, y: pos.y, z: pos.z }
  );

  await wait(300);
}

await wait(500);

// Circle around the brick!
const finalInfo = brick(heroId);
if (finalInfo) {
  const finalPos = finalInfo.position;
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
  },

  'dna-helix': {
    name: 'DNA Double Helix',
    description: 'Animated DNA structure with rotating helixes',
    code: `// DNA Double Helix
// Creates an animated DNA structure with base pairs!

const height = 20;
const radius = 75;
const twistsPerHeight = 2;

// Create the two spiraling strands
for (let i = 0; i < height; i++) {
  const angle1 = (i / height) * Math.PI * 2 * twistsPerHeight;
  const angle2 = angle1 + Math.PI;

  const x1 = Math.cos(angle1) * radius;
  const z1 = Math.sin(angle1) * radius;
  const x2 = Math.cos(angle2) * radius;
  const z2 = Math.sin(angle2) * radius;

  // Strand 1 - Blue
  createBrick({
    type: 'cylinder',
    color: '#0088ff',
    position: { x: x1, y: i * 25, z: z1 },
    dimensions: { x: 1, z: 1, y: 0.8 }
  });

  // Strand 2 - Red
  createBrick({
    type: 'cylinder',
    color: '#ff0088',
    position: { x: x2, y: i * 25, z: z2 },
    dimensions: { x: 1, z: 1, y: 0.8 }
  });

  // Base pairs (connecting bars) - every 3rd level
  if (i % 3 === 0) {
    const midX = (x1 + x2) / 2;
    const midZ = (z1 + z2) / 2;

    createBrick({
      type: 'rectangle',
      color: '#ffaa00',
      position: { x: midX, y: i * 25, z: midZ },
      dimensions: { x: 4, z: 1, y: 0.5 }
    });
  }

  await wait(80);
}`
  },

  'fractal-tree': {
    name: 'Fractal Tree',
    description: 'Recursive branching tree structure',
    code: `// Fractal Tree
// Watch a tree grow using recursion!

async function drawBranch(x, y, z, length, angle, depth) {
  if (depth === 0) return;

  // Calculate end position
  const endX = x + Math.cos(angle) * length;
  const endY = y + length;
  const endZ = z + Math.sin(angle) * length;

  // Draw branch segments
  const segments = Math.max(1, Math.floor(length / 20));
  for (let i = 0; i < segments; i++) {
    const t = i / segments;
    const brickX = x + (endX - x) * t;
    const brickY = y + (endY - y) * t;
    const brickZ = z + (endZ - z) * t;

    // Color transitions from brown to green
    const greenAmount = Math.floor(depth * 40);
    const color = depth > 2
      ? \`#00\${greenAmount.toString(16).padStart(2, '0')}00\`
      : '#8B4513';

    createBrick({
      type: depth > 2 ? 'cone' : 'cylinder',
      color: color,
      position: { x: brickX, y: brickY, z: brickZ },
      dimensions: { x: 1, z: 1, y: 0.6 }
    });

    await wait(20);
  }

  // Recursively draw child branches
  if (depth > 1) {
    const newLength = length * 0.67;
    const angleOffset = Math.PI / 6;

    await drawBranch(endX, endY, endZ, newLength, angle - angleOffset, depth - 1);
    await drawBranch(endX, endY, endZ, newLength, angle + angleOffset, depth - 1);
  }
}

// Start the tree from the ground
await drawBranch(0, 0, 0, 150, 0, 6);`
  },

  'matrix-rain': {
    name: 'Matrix Rain Effect',
    description: 'Falling digital rain like The Matrix!',
    code: `// Matrix Rain Effect
// Digital rain falling in columns!

const columns = 12;
const maxHeight = 15;
const spacing = 40;

// Create columns of "rain"
const rainColumns = [];
for (let col = 0; col < columns; col++) {
  rainColumns.push({
    x: col * spacing - (columns * spacing) / 2,
    height: Math.floor(Math.random() * maxHeight),
    speed: 1 + Math.random()
  });
}

// Animate the rain falling
for (let frame = 0; frame < 50; frame++) {
  for (let col = 0; col < rainColumns.length; col++) {
    const column = rainColumns[col];

    // Calculate drop positions
    for (let i = 0; i < 5; i++) {
      const y = (column.height + i * 33 - frame * column.speed * 8) % (maxHeight * 33);

      if (y >= 0 && y < maxHeight * 33) {
        const brightness = Math.floor((4 - i) * 50);
        const color = \`#00\${brightness.toString(16).padStart(2, '0')}00\`;

        createBrick({
          type: 'tile',
          color: color,
          position: { x: column.x, y: y, z: 0 },
          dimensions: { x: 1, z: 1 }
        });
      }
    }
  }

  await wait(100);

  // Clear for next frame (except first frame)
  if (frame > 0) {
    // In real implementation, we'd remove old bricks
    // For now, they'll just stack
  }
}`
  },

  'solar-system': {
    name: 'Solar System',
    description: 'Orbiting planets around a sun - v2.0 API!',
    code: `// Solar System - v2.0 API
// Watch planets orbit around the sun!

// Create the sun
createBrick({
  type: 'cylinder',
  color: '#ffdd00',
  position: { x: 0, y: 100, z: 0 },
  dimensions: { x: 4, z: 4, y: 1.5 }
});

// Planet data: [color, radius, speed, size]
const planets = [
  ['#888888', 80, 1.2, 1],    // Mercury
  ['#ffaa55', 120, 0.9, 1.5],  // Venus
  ['#0088ff', 160, 0.7, 1.5],  // Earth
  ['#ff4422', 200, 0.5, 1.2],  // Mars
  ['#cc8855', 280, 0.3, 3],    // Jupiter
];

const planetIds = planets.map(([color, radius, speed, size]) => {
  const angle = Math.random() * Math.PI * 2;
  return createBrick({
    type: 'cylinder',
    color: color,
    position: {
      x: Math.cos(angle) * radius,
      y: 100,
      z: Math.sin(angle) * radius
    },
    dimensions: { x: size, z: size, y: 0.8 }
  });
});

await wait(500);

// Animate orbital motion using animate()
for (let i = 0; i < 100; i++) {
  for (let p = 0; p < planets.length; p++) {
    const planetId = planetIds[p];
    if (!planetId) continue;

    const [_, radius, speed] = planets[p];
    const angle = (i * speed) * (Math.PI / 180);

    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    await animate(planetId).move({ x, y: 100, z }).run();
  }
  await wait(50);
}`
  },

  'fireworks': {
    name: 'Fireworks Display',
    description: 'Exploding fireworks with particle effects!',
    code: `// Fireworks Display
// Watch colorful explosions in the sky!

async function firework(x, z) {
  const colors = ['#ff0000', '#ff7700', '#ffdd00', '#00ff00', '#0088ff', '#ff00ff'];
  const color = colors[Math.floor(Math.random() * colors.length)];

  // Launch rocket
  const rocketId = createBrick({
    type: 'cylinder',
    color: color,
    position: { x, y: 0, z },
    dimensions: { x: 1, z: 1 }
  });

  if (!rocketId) {
    console.error("Failed to create rocket");
    return;
  }

  const launchHeight = 200 + Math.random() * 100;

  for (let h = 0; h < launchHeight; h += 10) {
    await animate(rocketId).move({ x, y: h, z }).run();
    await wait(20);
  }

  // Explosion!
  await deleteBrick(rocketId);

  const particles = 12;
  const explosionBricks = [];

  for (let i = 0; i < particles; i++) {
    const angle = (i / particles) * Math.PI * 2;
    const speed = 30 + Math.random() * 20;

    const particleX = x + Math.cos(angle) * 10;
    const particleZ = z + Math.sin(angle) * 10;

    const particleId = createBrick({
      type: 'cylinder',
      color: color,
      position: { x: particleX, y: launchHeight, z: particleZ },
      dimensions: { x: 1, z: 1, y: 0.5 }
    });

    if (particleId) {
      explosionBricks.push({ particleId, angle, speed });
    }
  }

  // Animate explosion
  for (let t = 0; t < 20; t++) {
    for (const { particleId, angle, speed } of explosionBricks) {
      const dist = speed * t;
      const newX = x + Math.cos(angle) * dist;
      const newZ = z + Math.sin(angle) * dist;
      const newY = launchHeight - t * t * 0.5; // Gravity

      await animate(particleId).move({ x: newX, y: newY, z: newZ }).run();
    }
    await wait(50);
  }

  // Fade out
  for (const { particleId } of explosionBricks) {
    await deleteBrick(particleId);
  }
}

// Launch multiple fireworks
await firework(0, 0);
await wait(300);
await firework(100, 50);
await wait(200);
await firework(-100, -50);
await wait(300);
await firework(50, -100);`
  },

  'mandelbrot-set': {
    name: 'Mandelbrot Set',
    description: 'Visualize the famous fractal pattern!',
    code: `// Mandelbrot Set Visualization
// Explore the famous fractal!

const width = 20;
const height = 15;
const maxIterations = 20;

// Mandelbrot coordinates
const xMin = -2.5, xMax = 1;
const yMin = -1, yMax = 1;

for (let px = 0; px < width; px++) {
  for (let py = 0; py < height; py++) {
    // Map pixel to complex plane
    const x0 = xMin + (px / width) * (xMax - xMin);
    const y0 = yMin + (py / height) * (yMax - yMin);

    let x = 0, y = 0;
    let iteration = 0;

    // Iterate the Mandelbrot function
    while (x*x + y*y <= 4 && iteration < maxIterations) {
      const xTemp = x*x - y*y + x0;
      y = 2*x*y + y0;
      x = xTemp;
      iteration++;
    }

    // Color based on iterations
    let color;
    if (iteration === maxIterations) {
      color = '#000000'; // In the set
    } else {
      const hue = (iteration / maxIterations) * 360;
      const saturation = 100;
      const lightness = 50;
      // Approximate HSL to hex
      const h = hue / 60;
      const c = (1 - Math.abs(2 * lightness / 100 - 1)) * saturation / 100;
      const x = c * (1 - Math.abs(h % 2 - 1));
      const rgb = h < 1 ? [c,x,0] : h < 2 ? [x,c,0] : h < 3 ? [0,c,x] :
                  h < 4 ? [0,x,c] : h < 5 ? [x,0,c] : [c,0,x];
      const r = Math.floor((rgb[0] + 0.5) * 255);
      const g = Math.floor((rgb[1] + 0.5) * 255);
      const b = Math.floor((rgb[2] + 0.5) * 255);
      color = '#' + [r,g,b].map(v => v.toString(16).padStart(2,'0')).join('');
    }

    createBrick({
      type: 'plate',
      color: color,
      position: { x: px * 30, y: 12, z: py * 30 },
      dimensions: { x: 1, z: 1 }
    });

    await wait(15);
  }
}`
  },

  'conway-game-of-life': {
    name: "Conway's Game of Life",
    description: 'Watch cells evolve in the classic simulation!',
    code: `// Conway's Game of Life
// Watch cellular automata come to life!

const size = 15;
const generations = 30;

// Initialize random grid
let grid = Array(size).fill().map(() =>
  Array(size).fill().map(() => Math.random() > 0.7)
);

// Count neighbors
function countNeighbors(grid, x, y) {
  let count = 0;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      const nx = (x + dx + size) % size;
      const ny = (y + dy + size) % size;
      if (grid[ny][nx]) count++;
    }
  }
  return count;
}

// Simulate generations
for (let gen = 0; gen < generations; gen++) {
  // Draw current generation
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (grid[y][x]) {
        // Color based on age
        const brightness = Math.min(255, gen * 8);
        const color = \`#00\${brightness.toString(16).padStart(2, '0')}ff\`;

        createBrick({
          type: 'plate',
          color: color,
          position: { x: x * 30, y: 12, z: y * 30 },
          dimensions: { x: 1, z: 1 }
        });
      }
    }
  }

  await wait(400);

  // Calculate next generation
  const newGrid = grid.map((row, y) =>
    row.map((cell, x) => {
      const neighbors = countNeighbors(grid, x, y);
      if (cell) {
        return neighbors === 2 || neighbors === 3;
      } else {
        return neighbors === 3;
      }
    })
  );

  grid = newGrid;
}`
  },

  'music-visualizer': {
    name: 'Music Visualizer',
    description: 'Animated bars responding to frequencies!',
    code: `// Music Visualizer
// Animated frequency bars like a music player!

const bars = 16;
const spacing = 35;
const maxHeight = 200;

// Create initial bars
const barIds = [];
for (let i = 0; i < bars; i++) {
  const x = i * spacing - (bars * spacing) / 2;
  const barId = createBrick({
    type: 'rectangle',
    color: '#00ff88',
    position: { x, y: 12, z: 0 },
    dimensions: { x: 1, z: 2, y: 0.5 }
  });
  if (barId) {
    barIds.push(barId);
  }
}

await wait(500);

// Animate the visualizer
for (let beat = 0; beat < 100; beat++) {
  for (let i = 0; i < barIds.length; i++) {
    // Simulate frequency data with sine waves
    const freq1 = Math.sin(beat * 0.1 + i * 0.3) * 0.5 + 0.5;
    const freq2 = Math.sin(beat * 0.15 + i * 0.5) * 0.3 + 0.3;
    const height = (freq1 * 0.7 + freq2 * 0.3) * maxHeight;

    // Color based on frequency
    const hue = (i / bars) * 300;
    const r = Math.floor(Math.sin(hue * Math.PI / 180) * 127 + 128);
    const g = Math.floor(Math.sin((hue + 120) * Math.PI / 180) * 127 + 128);
    const b = Math.floor(Math.sin((hue + 240) * Math.PI / 180) * 127 + 128);
    const color = '#' + [r,g,b].map(v => v.toString(16).padStart(2,'0')).join('');

    const x = i * spacing - (bars * spacing) / 2;
    await animate(barIds[i])
      .move({ x, y: height / 2, z: 0 })
      .color(color)
      .run();
  }

  await wait(50);
}`
  },

  'eiffel-tower': {
    name: 'Eiffel Tower',
    description: 'The iconic Paris landmark!',
    code: `// Eiffel Tower
// Build the famous Parisian monument!

// Base level - wide foundation
const baseSize = 6;
for (let x = 0; x < baseSize; x++) {
  for (let z = 0; z < baseSize; z++) {
    // Skip corners for octagonal shape
    if ((x === 0 || x === baseSize - 1) && (z === 0 || z === baseSize - 1)) continue;

    createBrick({
      type: 'plate',
      color: '#666666',
      position: { x: x * 30, y: 6, z: z * 30 },
      dimensions: { x: 1, z: 1 }
    });
    await wait(20);
  }
}

// First level - four legs
const legPositions = [
  { x: 0, z: 0 }, { x: 0, z: 150 },
  { x: 150, z: 0 }, { x: 150, z: 150 }
];

for (let level = 0; level < 5; level++) {
  for (const leg of legPositions) {
    createBrick({
      type: 'rectangle',
      color: '#888888',
      position: { x: leg.x, y: level * 33 + 20, z: leg.z },
      dimensions: { x: 2, z: 2, y: 1 }
    });
    await wait(15);
  }
}

// First platform
for (let x = 0; x < 4; x++) {
  for (let z = 0; z < 4; z++) {
    createBrick({
      type: 'plate',
      color: '#777777',
      position: { x: x * 40 + 20, y: 165, z: z * 40 + 20 },
      dimensions: { x: 1, z: 1 }
    });
    await wait(20);
  }
}

// Second level - narrowing tower
for (let level = 0; level < 6; level++) {
  const size = 3 - Math.floor(level / 3);
  for (let x = 0; x < size; x++) {
    for (let z = 0; z < size; z++) {
      createBrick({
        type: 'rectangle',
        color: '#999999',
        position: {
          x: x * 40 + 40,
          y: level * 33 + 185,
          z: z * 40 + 40
        },
        dimensions: { x: 1, z: 1, y: 1 }
      });
      await wait(15);
    }
  }
}

// Top spire
for (let i = 0; i < 4; i++) {
  createBrick({
    type: 'cylinder',
    color: '#aaaaaa',
    position: { x: 75, y: 380 + i * 25, z: 75 },
    dimensions: { x: 1, z: 1, y: 0.8 }
  });
  await wait(30);
}

// Top antenna
createBrick({
  type: 'cone',
  color: '#cccccc',
  position: { x: 75, y: 480, z: 75 },
  dimensions: { x: 1, z: 1, y: 1.5 }
});`
  },

  'statue-of-liberty': {
    name: 'Statue of Liberty',
    description: 'The symbol of freedom and democracy!',
    code: `// Statue of Liberty
// Build the iconic New York monument!

// Pedestal base
const baseSize = 5;
for (let y = 0; y < 3; y++) {
  for (let x = 0; x < baseSize; x++) {
    for (let z = 0; z < baseSize; z++) {
      createBrick({
        type: 'rectangle',
        color: '#8B7355',
        position: { x: x * 40, y: y * 33, z: z * 40 },
        dimensions: { x: 1, z: 1, y: 1 }
      });
      await wait(10);
    }
  }
}

// Pedestal narrowing
for (let y = 0; y < 4; y++) {
  const size = 4 - Math.floor(y / 2);
  const offset = (5 - size) * 20;
  for (let x = 0; x < size; x++) {
    for (let z = 0; z < size; z++) {
      createBrick({
        type: 'rectangle',
        color: '#A0826D',
        position: {
          x: x * 40 + offset,
          y: y * 33 + 99,
          z: z * 40 + offset
        },
        dimensions: { x: 1, z: 1, y: 1 }
      });
      await wait(10);
    }
  }
}

// Statue body
for (let y = 0; y < 5; y++) {
  createBrick({
    type: 'rectangle',
    color: '#81C784',
    position: { x: 80, y: y * 33 + 231, z: 80 },
    dimensions: { x: 2, z: 2, y: 1 }
  });
  await wait(30);
}

// Crown
for (let i = 0; i < 7; i++) {
  const angle = (i / 7) * Math.PI * 2;
  const radius = 30;
  const x = 80 + Math.cos(angle) * radius;
  const z = 80 + Math.sin(angle) * radius;

  createBrick({
    type: 'cone',
    color: '#66BB6A',
    position: { x, y: 396, z },
    dimensions: { x: 1, z: 1, y: 1.2 }
  });
  await wait(50);
}

// Torch (right arm)
createBrick({
  type: 'cylinder',
  color: '#81C784',
  position: { x: 120, y: 330, z: 80 },
  dimensions: { x: 1, z: 1, y: 2 }
});

await wait(100);

// Torch flame
createBrick({
  type: 'cone',
  color: '#FFD700',
  position: { x: 120, y: 396, z: 80 },
  dimensions: { x: 2, z: 2, y: 1 }
});`
  },

  'great-pyramid': {
    name: 'Great Pyramid of Giza',
    description: 'Ancient wonder of the world!',
    code: `// Great Pyramid of Giza
// Build the ancient Egyptian pyramid with smooth slopes!

const levels = 12;
const baseSize = 24;
const spacing = 25;

for (let level = 0; level < levels; level++) {
  const size = baseSize - level * 2;
  const offset = level * spacing;

  // Sandy limestone color
  const r = 220 - level * 8;
  const g = 200 - level * 8;
  const b = 150 - level * 8;
  const color = '#' + [r,g,b].map(v => Math.max(0, v).toString(16).padStart(2,'0')).join('');

  for (let x = 0; x < size; x++) {
    for (let z = 0; z < size; z++) {
      const isEdge = x === 0 || x === size - 1 || z === 0 || z === size - 1;
      const isCorner = (x === 0 || x === size - 1) && (z === 0 || z === size - 1);

      let brickType = 'rectangle';
      let rotation = 0;

      // Use slopes on edges for smooth pyramid sides
      if (isEdge && !isCorner) {
        brickType = 'slope45';

        // Rotate slopes to face outward
        if (x === 0) rotation = Math.PI / 2;        // West face
        else if (x === size - 1) rotation = -Math.PI / 2;  // East face
        else if (z === 0) rotation = Math.PI;       // North face
        else if (z === size - 1) rotation = 0;      // South face
      } else if (isCorner) {
        // Use corner slopes for pyramid corners
        brickType = 'cornerOutside';

        // Rotate corners appropriately
        if (x === 0 && z === 0) rotation = Math.PI / 2;
        else if (x === size - 1 && z === 0) rotation = Math.PI;
        else if (x === 0 && z === size - 1) rotation = 0;
        else if (x === size - 1 && z === size - 1) rotation = -Math.PI / 2;
      }

      createBrick({
        type: brickType,
        color: color,
        rotation: rotation,
        position: {
          x: x * spacing + offset,
          y: level * 33,
          z: z * spacing + offset
        },
        dimensions: { x: 1, z: 1, y: 1 }
      });
      await wait(5);
    }
  }
}

// Capstone
createBrick({
  type: 'cone',
  color: '#FFD700',
  position: {
    x: (baseSize / 2) * spacing,
    y: levels * 33,
    z: (baseSize / 2) * spacing
  },
  dimensions: { x: 2, z: 2, y: 1.5 }
});`
  },

  'colosseum': {
    name: 'Roman Colosseum',
    description: 'Ancient Roman amphitheater!',
    code: `// Roman Colosseum
// Build the iconic Roman arena!

const radius = 120;
const segments = 24;
const levels = 4;

for (let level = 0; level < levels; level++) {
  const levelRadius = radius - level * 10;

  // Color variation by level
  const colors = ['#D4AF7A', '#C8A882', '#BCA08A', '#B09892'];
  const color = colors[level];

  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const x = Math.cos(angle) * levelRadius;
    const z = Math.sin(angle) * levelRadius;

    // Arches on first two levels
    if (level < 2) {
      createBrick({
        type: 'arch',
        color: color,
        position: { x, y: level * 50 + 25, z },
        dimensions: { x: 2, z: 2, y: 1.5 }
      });
    } else {
      createBrick({
        type: 'rectangle',
        color: color,
        position: { x, y: level * 50 + 25, z },
        dimensions: { x: 2, z: 2, y: 1.5 }
      });
    }

    await wait(15);
  }
}

// Inner arena floor
const arenaSize = 8;
const arenaSpacing = 30;
for (let x = 0; x < arenaSize; x++) {
  for (let z = 0; z < arenaSize; z++) {
    const centerX = x * arenaSpacing - (arenaSize * arenaSpacing) / 2;
    const centerZ = z * arenaSpacing - (arenaSize * arenaSpacing) / 2;

    createBrick({
      type: 'plate',
      color: '#D2B48C',
      position: { x: centerX, y: 6, z: centerZ },
      dimensions: { x: 1, z: 1 }
    });
    await wait(10);
  }
}`
  },

  'taj-mahal': {
    name: 'Taj Mahal',
    description: 'Monument to eternal love!',
    code: `// Taj Mahal
// Build the stunning white marble mausoleum!

const white = '#F5F5F5';
const marble = '#FFFAFA';

// Base platform
const platformSize = 10;
for (let x = 0; x < platformSize; x++) {
  for (let z = 0; z < platformSize; z++) {
    createBrick({
      type: 'plate',
      color: '#E8E8E8',
      position: { x: x * 35, y: 6, z: z * 35 },
      dimensions: { x: 1, z: 1 }
    });
    await wait(8);
  }
}

// Main building base
const buildingSize = 6;
const offset = (platformSize - buildingSize) * 17.5;
for (let y = 0; y < 3; y++) {
  for (let x = 0; x < buildingSize; x++) {
    for (let z = 0; z < buildingSize; z++) {
      createBrick({
        type: 'rectangle',
        color: marble,
        position: {
          x: x * 35 + offset,
          y: y * 33 + 20,
          z: z * 35 + offset
        },
        dimensions: { x: 1, z: 1, y: 1 }
      });
      await wait(10);
    }
  }
}

// Four corner minarets
const minaretPositions = [
  { x: offset - 35, z: offset - 35 },
  { x: offset - 35, z: offset + buildingSize * 35 },
  { x: offset + buildingSize * 35, z: offset - 35 },
  { x: offset + buildingSize * 35, z: offset + buildingSize * 35 }
];

for (const pos of minaretPositions) {
  for (let y = 0; y < 8; y++) {
    createBrick({
      type: 'cylinder',
      color: white,
      position: { x: pos.x, y: y * 33 + 20, z: pos.z },
      dimensions: { x: 1, z: 1, y: 1 }
    });
    await wait(15);
  }

  // Minaret dome
  createBrick({
    type: 'cone',
    color: marble,
    position: { x: pos.x, y: 284, z: pos.z },
    dimensions: { x: 1.5, z: 1.5, y: 1 }
  });
  await wait(30);
}

// Central dome
const centerX = offset + (buildingSize * 35) / 2;
const centerZ = offset + (buildingSize * 35) / 2;

for (let i = 0; i < 3; i++) {
  const size = 3 - i;
  createBrick({
    type: 'cylinder',
    color: marble,
    position: { x: centerX, y: 119 + i * 33, z: centerZ },
    dimensions: { x: size, z: size, y: 1 }
  });
  await wait(40);
}

// Top dome
createBrick({
  type: 'cone',
  color: white,
  position: { x: centerX, y: 218, z: centerZ },
  dimensions: { x: 3, z: 3, y: 2 }
});`
  },

  'golden-gate-bridge': {
    name: 'Golden Gate Bridge',
    description: 'San Francisco\'s iconic suspension bridge!',
    code: `// Golden Gate Bridge
// Build the famous orange suspension bridge!

const bridgeColor = '#C0362C'; // International Orange
const cableColor = '#8B4513';
const length = 20;
const spacing = 35;

// Main deck
for (let i = 0; i < length; i++) {
  createBrick({
    type: 'plate',
    color: bridgeColor,
    position: { x: i * spacing, y: 50, z: 0 },
    dimensions: { x: 1, z: 3 }
  });
  await wait(20);
}

// Two main towers
const towerPositions = [length * spacing * 0.25, length * spacing * 0.75];

for (const towerX of towerPositions) {
  // Tower legs
  for (let y = 0; y < 10; y++) {
    createBrick({
      type: 'rectangle',
      color: bridgeColor,
      position: { x: towerX - 20, y: y * 33, z: 60 },
      dimensions: { x: 1, z: 1, y: 1 }
    });

    createBrick({
      type: 'rectangle',
      color: bridgeColor,
      position: { x: towerX - 20, y: y * 33, z: -60 },
      dimensions: { x: 1, z: 1, y: 1 }
    });

    await wait(15);
  }

  // Cross beam
  for (let z = -60; z <= 60; z += 30) {
    createBrick({
      type: 'rectangle',
      color: bridgeColor,
      position: { x: towerX - 20, y: 300, z: z },
      dimensions: { x: 1, z: 1, y: 0.5 }
    });
    await wait(15);
  }

  // Tower top
  createBrick({
    type: 'rectangle',
    color: bridgeColor,
    position: { x: towerX - 20, y: 363, z: 0 },
    dimensions: { x: 1, z: 3, y: 1.5 }
  });
}

// Suspension cables
for (let i = 0; i < length; i += 2) {
  const x = i * spacing;

  // Cable height follows parabolic curve
  const relativePos = (x - length * spacing / 2) / (length * spacing / 2);
  const sag = 100;
  const cableY = 300 - sag * (1 - relativePos * relativePos);

  createBrick({
    type: 'cylinder',
    color: cableColor,
    position: { x, y: cableY, z: 50 },
    dimensions: { x: 0.3, z: 0.3, y: (cableY - 50) / 33 }
  });

  createBrick({
    type: 'cylinder',
    color: cableColor,
    position: { x, y: cableY, z: -50 },
    dimensions: { x: 0.3, z: 0.3, y: (cableY - 50) / 33 }
  });

  await wait(25);
}`
  },

  'big-ben': {
    name: 'Big Ben Clock Tower',
    description: 'London\'s famous clock tower!',
    code: `// Big Ben Clock Tower
// Build London's iconic timepiece!

const stoneColor = '#D4C5B9';
const clockColor = '#F5F5DC';
const roofColor = '#4A5D23';

// Tower base
const baseSize = 3;
for (let y = 0; y < 3; y++) {
  for (let x = 0; x < baseSize; x++) {
    for (let z = 0; z < baseSize; z++) {
      createBrick({
        type: 'rectangle',
        color: stoneColor,
        position: { x: x * 40, y: y * 33, z: z * 40 },
        dimensions: { x: 1, z: 1, y: 1 }
      });
      await wait(15);
    }
  }
}

// Main tower shaft
for (let y = 0; y < 12; y++) {
  for (let x = 0; x < 2; x++) {
    for (let z = 0; z < 2; z++) {
      createBrick({
        type: 'rectangle',
        color: stoneColor,
        position: { x: x * 40 + 20, y: y * 33 + 99, z: z * 40 + 20 },
        dimensions: { x: 1, z: 1, y: 1 }
      });
      await wait(10);
    }
  }
}

// Clock faces (four sides)
const clockY = 495;
const clockPositions = [
  { x: 40, z: 0 },   // Front
  { x: 80, z: 40 },  // Right
  { x: 40, z: 80 },  // Back
  { x: 0, z: 40 }    // Left
];

for (const pos of clockPositions) {
  createBrick({
    type: 'cylinder',
    color: clockColor,
    position: { x: pos.x, y: clockY, z: pos.z },
    dimensions: { x: 2, z: 2, y: 0.3 }
  });
  await wait(50);
}

// Belfry (bell chamber)
for (let y = 0; y < 2; y++) {
  for (let x = 0; x < 2; x++) {
    for (let z = 0; z < 2; z++) {
      createBrick({
        type: 'arch',
        color: stoneColor,
        position: { x: x * 40 + 20, y: y * 33 + 528, z: z * 40 + 20 },
        dimensions: { x: 1, z: 1, y: 1 }
      });
      await wait(20);
    }
  }
}

// Spire
for (let i = 0; i < 5; i++) {
  const size = Math.max(1, 2 - i * 0.3);
  createBrick({
    type: 'cone',
    color: roofColor,
    position: { x: 40, y: 594 + i * 33, z: 40 },
    dimensions: { x: size, z: size, y: 1 }
  });
  await wait(30);
}`
  },

  'leaning-tower-pisa': {
    name: 'Leaning Tower of Pisa',
    description: 'The famous tilted Italian bell tower!',
    code: `// Leaning Tower of Pisa
// Build the world's most famous architectural mistake!

const marbleColor = '#F5F5DC';
const levels = 8;
const radius = 50;
const segments = 12;

// Build the tower leaning to one side
const leanAngle = 0.1; // Slight lean

for (let level = 0; level < levels; level++) {
  // Lean offset increases with height
  const leanOffset = level * level * 2;

  // Circular level
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const x = Math.cos(angle) * radius + leanOffset;
    const z = Math.sin(angle) * radius;

    // Colonnade style - cylinders for columns
    createBrick({
      type: 'cylinder',
      color: marbleColor,
      position: { x, y: level * 50 + 25, z },
      dimensions: { x: 1, z: 1, y: 1.5 }
    });

    await wait(20);
  }

  // Fill in the circular floor
  if (level % 2 === 0) {
    const floorSegments = 6;
    for (let fx = 0; fx < floorSegments; fx++) {
      for (let fz = 0; fz < floorSegments; fz++) {
        const centerX = fx * 20 - 50 + leanOffset;
        const centerZ = fz * 20 - 50;
        const dist = Math.sqrt(centerX * centerX + centerZ * centerZ);

        if (dist < radius - 10) {
          createBrick({
            type: 'plate',
            color: marbleColor,
            position: { x: centerX, y: level * 50 + 12, z: centerZ },
            dimensions: { x: 1, z: 1 }
          });
          await wait(10);
        }
      }
    }
  }
}

// Bell chamber at top
const topLevel = levels;
const topLeanOffset = topLevel * topLevel * 2;

for (let i = 0; i < segments; i++) {
  const angle = (i / segments) * Math.PI * 2;
  const x = Math.cos(angle) * (radius - 10) + topLeanOffset;
  const z = Math.sin(angle) * (radius - 10);

  createBrick({
    type: 'arch',
    color: marbleColor,
    position: { x, y: topLevel * 50 + 25, z },
    dimensions: { x: 1, z: 1, y: 1.2 }
  });
  await wait(25);
}

// Top dome
createBrick({
  type: 'cone',
  color: '#E8E8E8',
  position: { x: topLeanOffset, y: topLevel * 50 + 85, z: 0 },
  dimensions: { x: 2, z: 2, y: 1 }
});`
  }
};

export const examplesList = Object.keys(scriptExamples).map(key => ({
  id: key,
  ...scriptExamples[key]
}));
