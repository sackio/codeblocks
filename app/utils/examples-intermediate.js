/**
 * INTERMEDIATE LEVEL EXAMPLES
 * Skill Level: Ages 10-15, developers, users comfortable with programming
 *
 * Features demonstrated:
 * - New collision API methods (testPosition, findFreePosition, getCollisions)
 * - Complex animation sequences with parallel execution
 * - Querying and analyzing bricks (getBounds, getCenter, getVolume)
 * - Region-based operations (getBricksInRegion)
 * - Combining multiple API features
 * - Error handling and validation
 */

export const intermediateExamples = {
  'intermediate-collision-aware-builder': {
    name: 'Collision-Aware Builder',
    description: 'Build intelligently using collision detection',
    difficulty: 'intermediate',
    code: `// Collision-Aware Builder
// Use testPosition() to check before placing bricks!

const positions = [
  { x: 0, y: 24, z: 0 },
  { x: 25, y: 24, z: 0 },
  { x: 50, y: 24, z: 0 }
];

for (const pos of positions) {
  // Test the position first
  const test = testPosition(pos, { x: 2, z: 2 });

  if (!test.collision) {
    createBrick({
      color: '#00ff00',
      position: pos,
      dimensions: { x: 2, z: 2 }
    });
    console.log(\`✓ Placed brick at (\${pos.x}, \${pos.z})\`);
  } else {
    console.log(\`✗ Position occupied by \${test.collidingBricks.length} brick(s)\`);

    // Find a free position nearby
    const freePos = findFreePosition(pos, { x: 2, z: 2 });
    if (freePos) {
      createBrick({
        color: '#ffaa00',
        position: freePos,
        dimensions: { x: 2, z: 2 }
      });
      console.log(\`  → Placed at free position (\${freePos.x}, \${freePos.z})\`);
    }
  }

  await wait(300);
}

console.log("Building complete!");`
  },

  'intermediate-smart-stacking': {
    name: 'Smart Stacking',
    description: 'Stack bricks intelligently with collision checking',
    difficulty: 'intermediate',
    code: `// Smart Stacking System
// Automatically find the next free vertical position!

async function stackBrick(x, z, color) {
  // Start at ground level
  let y = 24;
  let placed = false;

  // Try positions going up
  while (y < 200 && !placed) {
    const test = testPosition({ x, y, z }, { x: 2, z: 2 });

    if (!test.collision) {
      createBrick({
        color: color,
        position: { x, y, z },
        dimensions: { x: 2, z: 2 }
      });
      console.log(\`Placed brick at height \${y}\`);
      placed = true;
    } else {
      // Try next level up
      y += 33;
    }
  }

  await wait(200);
}

// Build a smart stack!
const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

for (let i = 0; i < 10; i++) {
  await stackBrick(0, 0, colors[i % colors.length]);
}

console.log("Smart stack complete!");`
  },

  'intermediate-region-query': {
    name: 'Region Query',
    description: 'Find and analyze bricks in a specific region',
    difficulty: 'intermediate',
    code: `// Region Query System
// Create bricks and then query by region!

// Create a 3x3 grid of bricks
console.log("Creating brick grid...");
for (let x = 0; x < 3; x++) {
  for (let z = 0; z < 3; z++) {
    createBrick({
      color: \`hsl(\${(x * 3 + z) * 40}, 70%, 60%)\`,
      position: { x: x * 50, y: 24, z: z * 50 },
      dimensions: { x: 2, z: 2 }
    });
  }
}

await wait(500);

// Query different regions
const regions = [
  {
    name: "Left column",
    bounds: {
      min: { x: -25, y: 0, z: -25 },
      max: { x: 25, y: 50, z: 125 }
    }
  },
  {
    name: "Center area",
    bounds: {
      min: { x: 25, y: 0, z: 25 },
      max: { x: 75, y: 50, z: 75 }
    }
  },
  {
    name: "All bricks",
    bounds: {
      min: { x: -50, y: 0, z: -50 },
      max: { x: 150, y: 50, z: 150 }
    }
  }
];

for (const region of regions) {
  const bricks = getBricksInRegion(region.bounds);
  console.log(\`\${region.name}: \${bricks.length} brick(s)\`);

  // Calculate total volume
  let totalVolume = 0;
  for (const brick of bricks) {
    const volume = getVolume(brick.id);
    if (volume) totalVolume += volume;
  }
  console.log(\`  Total volume: \${totalVolume} cubic units\`);

  await wait(500);
}

console.log("Region analysis complete!");`
  },

  'intermediate-parallel-animations': {
    name: 'Parallel Animations',
    description: 'Animate multiple bricks simultaneously',
    difficulty: 'intermediate',
    code: `// Parallel Animations
// Use Promise.all() to run animations together!

// Create a row of bricks
const brickIds = [];
const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

for (let i = 0; i < 6; i++) {
  const id = createBrick({
    color: colors[i],
    position: { x: i * 50, y: 24, z: 0 },
    dimensions: { x: 2, z: 2 }
  });
  brickIds.push(id);
}

await wait(500);

// Animate them all at once!
console.log("Starting wave animation...");

await Promise.all(
  brickIds.map((id, index) =>
    animate(id)
      .wait(index * 100)  // Stagger the start
      .moveBy({ x: 0, y: 50, z: 0 })
      .wait(300)
      .moveBy({ x: 0, y: -50, z: 0 })
      .run()
  )
);

console.log("Wave complete!");

// Now do a color wave
console.log("Color wave...");

await Promise.all(
  brickIds.map((id, index) =>
    animate(id)
      .wait(index * 100)
      .color('#ffffff')
      .wait(200)
      .color(colors[index])
      .run()
  )
);

console.log("Animations complete!");`
  },

  'intermediate-bounds-analysis': {
    name: 'Bounds Analysis',
    description: 'Analyze brick sizes and positions using getBounds()',
    difficulty: 'intermediate',
    code: `// Bounds Analysis
// Use getBounds(), getCenter(), and getVolume() to analyze bricks!

// Create bricks of different sizes
console.log("Creating test bricks...");

const brick1 = createBrick({
  color: 'red',
  position: { x: 0, y: 24, z: 0 },
  dimensions: { x: 2, z: 2 }
});

const brick2 = createBrick({
  color: 'blue',
  position: { x: 75, y: 24, z: 0 },
  dimensions: { x: 4, z: 2 }  // Wider brick
});

const brick3 = createBrick({
  color: 'green',
  position: { x: 150, y: 24, z: 0 },
  dimensions: { x: 2, z: 4 }  // Deeper brick
});

await wait(500);

// Analyze each brick
const bricks = [
  { id: brick1, name: "Brick 1 (2x2)" },
  { id: brick2, name: "Brick 2 (4x2)" },
  { id: brick3, name: "Brick 3 (2x4)" }
];

for (const { id, name } of bricks) {
  if (!id) continue;

  console.log(\`\\n=== \${name} ===\");

  const bounds = getBounds(id);
  console.log("Bounds:", bounds);
  console.log(\`  Width: \${bounds.max.x - bounds.min.x}\`);
  console.log(\`  Height: \${bounds.max.y - bounds.min.y}\`);
  console.log(\`  Depth: \${bounds.max.z - bounds.min.z}\`);

  const center = getCenter(id);
  console.log("Center:", center);

  const volume = getVolume(id);
  console.log(\`Volume: \${volume} cubic units\`);

  await wait(500);
}

console.log("\\nAnalysis complete!");`
  },

  'intermediate-collision-checker': {
    name: 'Collision Checker',
    description: 'Find and visualize colliding bricks',
    difficulty: 'intermediate',
    code: `// Collision Checker
// Use getCollisions() to find overlapping bricks!

// Create some bricks with forced overlaps
console.log("Creating test bricks...");

const brick1 = createBrick({
  color: 'red',
  position: { x: 0, y: 24, z: 0 },
  dimensions: { x: 2, z: 2 }
});

const brick2 = createBrick({
  color: 'blue',
  position: { x: 10, y: 24, z: 10 },  // Partially overlaps
  dimensions: { x: 2, z: 2 },
  force: true
});

const brick3 = createBrick({
  color: 'green',
  position: { x: 50, y: 24, z: 0 },  // No overlap
  dimensions: { x: 2, z: 2 }
});

await wait(500);

// Check each brick for collisions
const bricks = [brick1, brick2, brick3];

for (const id of bricks) {
  if (!id) continue;

  const collisions = getCollisions(id);
  const brickInfo = brick(id);

  if (collisions.length > 0) {
    console.log(\`Brick at (\${brickInfo.position.x}, \${brickInfo.position.z}) has \${collisions.length} collision(s)!\`);

    // Highlight colliding brick
    await animate(id)
      .color('#ffff00')
      .wait(300)
      .color(brickInfo.color)
      .run();
  } else {
    console.log(\`Brick at (\${brickInfo.position.x}, \${brickInfo.position.z}) is collision-free ✓\`);
  }

  await wait(500);
}

console.log("Collision check complete!");`
  },

  'intermediate-grid-builder': {
    name: 'Grid Builder with Gaps',
    description: 'Build a grid with automatic gap detection',
    difficulty: 'intermediate',
    code: `// Grid Builder with Gaps
// Detect and fill gaps in a grid pattern!

const gridSize = 4;
const spacing = 50;

// Create a grid with some random gaps
console.log("Creating grid with gaps...");
for (let x = 0; x < gridSize; x++) {
  for (let z = 0; z < gridSize; z++) {
    // 70% chance to create brick (30% gaps)
    if (Math.random() > 0.3) {
      createBrick({
        color: '#888888',
        position: { x: x * spacing, y: 24, z: z * spacing },
        dimensions: { x: 2, z: 2 }
      });
    }
  }
}

await wait(1000);

// Find and fill the gaps
console.log("Finding gaps...");
let filled = 0;

for (let x = 0; x < gridSize; x++) {
  for (let z = 0; z < gridSize; z++) {
    const pos = { x: x * spacing, y: 24, z: z * spacing };
    const test = testPosition(pos, { x: 2, z: 2 });

    if (!test.collision) {
      // Found a gap!
      createBrick({
        color: '#00ff00',
        position: pos,
        dimensions: { x: 2, z: 2 }
      });
      filled++;
      await wait(200);
    }
  }
}

console.log(\`Filled \${filled} gap(s)!\`);`
  },

  'intermediate-color-by-region': {
    name: 'Color by Region',
    description: 'Change brick colors based on their region',
    difficulty: 'intermediate',
    code: `// Color by Region
// Query regions and color-code bricks!

// Create a 5x5 grid
console.log("Creating grid...");
for (let x = 0; x < 5; x++) {
  for (let z = 0; z < 5; z++) {
    createBrick({
      color: '#cccccc',
      position: { x: x * 50, y: 24, z: z * 50 },
      dimensions: { x: 2, z: 2 }
    });
  }
}

await wait(500);

// Define regions with colors
const regions = [
  {
    name: "Top-left (Red)",
    color: '#ff0000',
    bounds: { min: { x: -25, y: 0, z: -25 }, max: { x: 75, y: 50, z: 75 } }
  },
  {
    name: "Top-right (Blue)",
    color: '#0000ff',
    bounds: { min: { x: 75, y: 0, z: -25 }, max: { x: 225, y: 50, z: 75 } }
  },
  {
    name: "Bottom-left (Green)",
    color: '#00ff00',
    bounds: { min: { x: -25, y: 0, z: 75 }, max: { x: 75, y: 50, z: 225 } }
  },
  {
    name: "Bottom-right (Yellow)",
    color: '#ffff00',
    bounds: { min: { x: 75, y: 0, z: 75 }, max: { x: 225, y: 50, z: 225 } }
  }
];

// Color each region
for (const region of regions) {
  console.log(\`Coloring \${region.name}...\`);
  const bricks = getBricksInRegion(region.bounds);

  for (const b of bricks) {
    await animate(b.id)
      .color(region.color)
      .run();
    await wait(50);
  }

  await wait(300);
}

console.log("Regions colored!");`
  },

  'intermediate-proximity-detector': {
    name: 'Proximity Detector',
    description: 'Detect and react to nearby bricks',
    difficulty: 'intermediate',
    code: `// Proximity Detector
// Bricks light up when others are nearby!

// Create a moving brick
const mover = createBrick({
  color: '#ffffff',
  position: { x: -100, y: 24, z: 0 },
  dimensions: { x: 2, z: 2 }
});

// Create target bricks
const targets = [];
for (let i = 0; i < 5; i++) {
  const id = createBrick({
    color: '#444444',
    position: { x: i * 50, y: 24, z: 0 },
    dimensions: { x: 2, z: 2 }
  });
  targets.push(id);
}

await wait(500);

// Move the white brick across
console.log("Starting proximity scan...");

for (let x = -100; x <= 250; x += 25) {
  // Move the scanner brick
  await animate(mover).move({ x, y: 24, z: 0 }).run();

  // Check proximity to each target
  const moverInfo = brick(mover);
  const moverBounds = getBounds(mover);

  for (const targetId of targets) {
    const targetBounds = getBounds(targetId);

    // Calculate distance between centers
    const moverCenter = getCenter(mover);
    const targetCenter = getCenter(targetId);

    const distance = Math.sqrt(
      Math.pow(moverCenter.x - targetCenter.x, 2) +
      Math.pow(moverCenter.z - targetCenter.z, 2)
    );

    // Light up if within 60 units
    if (distance < 60) {
      await animate(targetId).color('#ffff00').run();
      console.log(\`Target at \${targetCenter.x} detected! (distance: \${Math.round(distance)})\`);
    } else {
      await animate(targetId).color('#444444').run();
    }
  }

  await wait(200);
}

console.log("Scan complete!");`
  },

  'intermediate-layer-manager': {
    name: 'Layer Manager',
    description: 'Organize and manipulate bricks by layers',
    difficulty: 'intermediate',
    code: `// Layer Manager
// Create and manipulate different layers!

// Create 3 layers with different colors
const layers = [
  { y: 24, color: '#ff0000', name: 'Layer 1' },
  { y: 57, color: '#00ff00', name: 'Layer 2' },
  { y: 90, color: '#0000ff', name: 'Layer 3' }
];

console.log("Building layers...");

// Build each layer
for (const layer of layers) {
  for (let x = 0; x < 3; x++) {
    for (let z = 0; z < 3; z++) {
      createBrick({
        color: layer.color,
        position: { x: x * 50, y: layer.y, z: z * 50 },
        dimensions: { x: 2, z: 2 }
      });
    }
  }
  await wait(300);
}

await wait(500);

// Query and manipulate each layer
for (const layer of layers) {
  console.log(\`\\nProcessing \${layer.name}...\`);

  // Define layer bounds (y +/- 5 units)
  const layerBounds = {
    min: { x: -50, y: layer.y - 5, z: -50 },
    max: { x: 200, y: layer.y + 5, z: 200 }
  };

  const bricksInLayer = getBricksInRegion(layerBounds);
  console.log(\`  Found \${bricksInLayer.length} brick(s)\`);

  // Flash the layer
  for (const b of bricksInLayer) {
    await animate(b.id)
      .color('#ffffff')
      .wait(100)
      .color(layer.color)
      .run();
  }

  await wait(500);
}

console.log("Layer management complete!");`
  }
};
