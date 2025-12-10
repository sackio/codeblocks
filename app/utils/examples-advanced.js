/**
 * ADVANCED LEVEL EXAMPLES
 * Skill Level: Professional developers, advanced users
 *
 * Features demonstrated:
 * - Performance optimization with batch operations
 * - Complex geometric patterns with collision detection
 * - Advanced algorithmic patterns
 * - Sophisticated animation choreography
 * - Manual collision control for complex scenarios
 * - Combining all API features for advanced effects
 */

export const advancedExamples = {
  'advanced-optimized-batch': {
    name: 'Optimized Batch Creation',
    description: 'Create many bricks efficiently with manual collision control',
    difficulty: 'advanced',
    code: `// Optimized Batch Creation
// Disable collision checking for bulk operations, then validate!

console.log("Creating 100 bricks with optimized batch mode...");
const startTime = performance.now();

const brickIds = [];
const gridSize = 10;
const spacing = 40;

// Batch create with checkCollision: false for speed
for (let x = 0; x < gridSize; x++) {
  for (let z = 0; z < gridSize; z++) {
    const id = createBrick({
      color: \`hsl(\${(x * gridSize + z) * 3.6}, 70%, 60%)\`,
      position: {
        x: x * spacing - (gridSize * spacing) / 2,
        y: 24,
        z: z * spacing - (gridSize * spacing) / 2
      },
      dimensions: { x: 1, z: 1 },
      checkCollision: false,  // Skip collision for performance
      render: true
    });
    if (id) brickIds.push(id);
  }
}

const createTime = performance.now() - startTime;
console.log(\`Created \${brickIds.length} bricks in \${createTime.toFixed(2)}ms\`);

// Validate afterwards
console.log("Running post-creation collision check...");
let collisionCount = 0;

for (const id of brickIds) {
  const collisions = getCollisions(id);
  if (collisions.length > 0) {
    collisionCount += collisions.length;
  }
}

console.log(\`Collision check complete: \${collisionCount} collision(s) detected\`);
console.log(\`Average time per brick: \${(createTime / brickIds.length).toFixed(2)}ms\`);`
  },

  'advanced-spiral-galaxy': {
    name: 'Spiral Galaxy',
    description: 'Create a 3D spiral using polar coordinates and collision detection',
    difficulty: 'advanced',
    code: `// Spiral Galaxy
// Advanced geometric pattern with polar coordinates!

console.log("Generating spiral galaxy...");

const arms = 3;
const pointsPerArm = 20;
const brickIds = [];

for (let arm = 0; arm < arms; arm++) {
  const armAngleOffset = (arm / arms) * Math.PI * 2;

  for (let i = 0; i < pointsPerArm; i++) {
    const t = i / pointsPerArm;
    const radius = t * 150;
    const angle = armAngleOffset + t * Math.PI * 4;  // 2 full rotations
    const height = 24 + t * 100;  // Rise as spiral extends

    // Convert polar to Cartesian
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    // Check for collisions first
    const pos = { x, y: height, z };
    const dims = { x: 1, z: 1 };
    const test = testPosition(pos, dims);

    if (!test.collision) {
      const hue = (arm / arms) * 360;
      const id = createBrick({
        color: \`hsl(\${hue}, 80%, \${60 + t * 20}%)\`,
        position: pos,
        dimensions: dims
      });
      if (id) brickIds.push(id);
    }

    await wait(30);
  }
}

console.log(\`Galaxy created with \${brickIds.length} stars!\`);

// Rotate the entire galaxy
console.log("Animating galaxy rotation...");

for (let frame = 0; frame < 30; frame++) {
  const rotationAngle = (frame / 30) * Math.PI * 2;

  await Promise.all(
    brickIds.map(async (id, index) => {
      const info = brick(id);
      if (!info) return;

      // Rotate around Y axis
      const currentRadius = Math.sqrt(info.position.x ** 2 + info.position.z ** 2);
      const currentAngle = Math.atan2(info.position.z, info.position.x);
      const newAngle = currentAngle + rotationAngle / 30;

      const newX = Math.cos(newAngle) * currentRadius;
      const newZ = Math.sin(newAngle) * currentRadius;

      return animate(id)
        .move({ x: newX, y: info.position.y, z: newZ })
        .run();
    })
  );

  await wait(50);
}

console.log("Galaxy animation complete!");`
  },

  'advanced-collision-physics': {
    name: 'Collision Physics Simulator',
    description: 'Simulate bouncing with collision detection',
    difficulty: 'advanced',
    code: `// Collision Physics Simulator
// Simulate a bouncing ball with real collision detection!

console.log("Starting physics simulation...");

// Create floor
const floorBricks = [];
for (let x = -3; x <= 3; x++) {
  for (let z = -3; z <= 3; z++) {
    const id = createBrick({
      color: '#888888',
      position: { x: x * 50, y: 12, z: z * 50 },
      dimensions: { x: 2, z: 2 }
    });
    if (id) floorBricks.push(id);
  }
}

// Create walls
for (let y = 1; y < 5; y++) {
  for (let x = -3; x <= 3; x++) {
    createBrick({
      color: '#666666',
      position: { x: x * 50, y: y * 33 + 12, z: -150 },
      dimensions: { x: 2, z: 2 }
    });
    createBrick({
      color: '#666666',
      position: { x: x * 50, y: y * 33 + 12, z: 150 },
      dimensions: { x: 2, z: 2 }
    });
  }
}

await wait(500);

// Create ball
const ball = createBrick({
  color: '#ff0000',
  position: { x: 0, y: 150, z: 0 },
  dimensions: { x: 1, z: 1 }
});

// Physics simulation
let posX = 0, posY = 150, posZ = 0;
let velX = 15, velY = 0, velZ = 12;
const gravity = -5;
const damping = 0.8;
const dt = 0.1;  // time step

console.log("Ball dropped! Simulating physics...");

for (let step = 0; step < 100; step++) {
  // Apply gravity
  velY += gravity * dt;

  // Update position
  posX += velX * dt;
  posY += velY * dt;
  posZ += velZ * dt;

  // Check for floor collision
  if (posY < 24) {
    posY = 24;
    velY = -velY * damping;  // Bounce with energy loss
    velX *= 0.95;  // Friction
    velZ *= 0.95;
  }

  // Check for wall collisions using bounds
  const bounds = getBounds(ball);
  if (bounds) {
    if (bounds.min.x < -150 || bounds.max.x > 150) {
      velX = -velX * damping;
    }
    if (bounds.min.z < -150 || bounds.max.z > 150) {
      velZ = -velZ * damping;
    }
  }

  // Move ball
  await animate(ball)
    .move({ x: posX, y: posY, z: posZ })
    .run();

  // Stop if velocity is very low
  const speed = Math.sqrt(velX ** 2 + velY ** 2 + velZ ** 2);
  if (speed < 1 && Math.abs(posY - 24) < 1) {
    console.log("Ball came to rest");
    break;
  }

  await wait(50);
}

console.log("Simulation complete!");`
  },

  'advanced-space-partitioning': {
    name: 'Space Partitioning Grid',
    description: 'Efficient spatial queries using region-based partitioning',
    difficulty: 'advanced',
    code: `// Space Partitioning Grid
// Demonstrate efficient spatial queries with getBricksInRegion()!

console.log("Creating randomly distributed bricks...");

// Create 50 randomly positioned bricks
const brickIds = [];
const worldSize = 300;

for (let i = 0; i < 50; i++) {
  const x = (Math.random() - 0.5) * worldSize;
  const y = 24;
  const z = (Math.random() - 0.5) * worldSize;

  const id = createBrick({
    color: '#3388ff',
    position: { x, y, z },
    dimensions: { x: 1, z: 1 }
  });
  if (id) brickIds.push(id);
}

await wait(500);

// Define grid partitions
const partitions = [];
const gridSize = 3;
const cellSize = worldSize / gridSize;

for (let gx = 0; gx < gridSize; gx++) {
  for (let gz = 0; gz < gridSize; gz++) {
    const minX = -worldSize/2 + gx * cellSize;
    const minZ = -worldSize/2 + gz * cellSize;

    partitions.push({
      id: \`cell_\${gx}_\${gz}\`,
      bounds: {
        min: { x: minX, y: 0, z: minZ },
        max: { x: minX + cellSize, y: 50, z: minZ + cellSize }
      }
    });
  }
}

console.log(\`Created \${partitions.length} spatial partitions\`);

// Query each partition
console.log("\\nQuerying partitions:");
const partitionStats = [];

for (const partition of partitions) {
  const bricks = getBricksInRegion(partition.bounds);
  partitionStats.push({
    id: partition.id,
    count: bricks.length,
    bricks: bricks
  });

  console.log(\`  \${partition.id}: \${bricks.length} brick(s)\`);

  // Color-code by density
  let color;
  if (bricks.length === 0) color = '#111111';
  else if (bricks.length < 3) color = '#00ff00';
  else if (bricks.length < 6) color = '#ffff00';
  else color = '#ff0000';

  for (const b of bricks) {
    await animate(b.id).color(color).run();
  }

  await wait(200);
}

// Find and highlight the densest partition
const densest = partitionStats.reduce((max, p) =>
  p.count > max.count ? p : max
);

console.log(\`\\nDensest partition: \${densest.id} with \${densest.count} bricks\`);

for (const b of densest.bricks) {
  await animate(b.id)
    .color('#ffffff')
    .wait(100)
    .color('#ff0000')
    .run();
}

console.log("Spatial partitioning demo complete!");`
  },

  'advanced-procedural-building': {
    name: 'Procedural Building Generator',
    description: 'Generate a random building with collision-aware placement',
    difficulty: 'advanced',
    code: `// Procedural Building Generator
// Generate unique buildings using collision detection!

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function generateFloor(baseX, baseZ, floorY, width, depth, color) {
  const bricks = [];

  // Create walls
  for (let x = 0; x < width; x++) {
    for (let z = 0; z < depth; z++) {
      // Only walls (perimeter)
      if (x === 0 || x === width - 1 || z === 0 || z === depth - 1) {
        const pos = {
          x: baseX + x * 25,
          y: floorY,
          z: baseZ + z * 25
        };

        // Check if position is free
        const test = testPosition(pos, { x: 1, z: 1 });
        if (!test.collision) {
          const id = createBrick({
            color: color,
            position: pos,
            dimensions: { x: 1, z: 1 },
            checkCollision: false
          });
          if (id) bricks.push(id);
        }
      }
    }
  }

  return bricks;
}

console.log("Generating procedural building...");

const floors = randomInt(3, 6);
const baseWidth = randomInt(4, 8);
const baseDepth = randomInt(4, 8);

console.log(\`Building specs: \${floors} floors, \${baseWidth}x\${baseDepth} base\`);

const allBricks = [];

for (let floor = 0; floor < floors; floor++) {
  // Each floor gets slightly smaller (stepped design)
  const width = Math.max(3, baseWidth - floor);
  const depth = Math.max(3, baseDepth - floor);
  const floorY = 24 + floor * 33;

  // Color gradient from bottom to top
  const hue = 200 + (floor / floors) * 60;  // Blue to cyan
  const color = \`hsl(\${hue}, 60%, 50%)\`;

  console.log(\`Building floor \${floor + 1}/\${floors}...\`);

  const floorBricks = await generateFloor(
    -(width * 25) / 2,   // Center the building
    -(depth * 25) / 2,
    floorY,
    width,
    depth,
    color
  );

  allBricks.push(...floorBricks);
  await wait(300);
}

console.log(\`Building complete! \${allBricks.length} bricks used.\`);

// Add a spire on top
console.log("Adding spire...");
const spireHeight = 3;
const topFloorY = 24 + floors * 33;

for (let i = 0; i < spireHeight; i++) {
  createBrick({
    color: '#ffff00',
    position: { x: 0, y: topFloorY + i * 33, z: 0 },
    dimensions: { x: 1, z: 1 }
  });
  await wait(200);
}

console.log("Procedural building complete!");

// Calculate building statistics
const buildingBounds = {
  min: { x: -200, y: 20, z: -200 },
  max: { x: 200, y: topFloorY + spireHeight * 33 + 10, z: 200 }
};

const totalBricks = getBricksInRegion(buildingBounds);
let totalVolume = 0;
for (const b of totalBricks) {
  totalVolume += getVolume(b.id) || 0;
}

console.log(\`\\nBuilding Stats:\`);
console.log(\`  Floors: \${floors}\`);
console.log(\`  Total bricks: \${totalBricks.length}\`);
console.log(\`  Total volume: \${totalVolume.toFixed(0)} cubic units\`);
console.log(\`  Height: \${(topFloorY + spireHeight * 33).toFixed(0)} units\`);`
  },

  'advanced-wave-propagation': {
    name: 'Wave Propagation',
    description: 'Simulate wave propagation with advanced animation',
    difficulty: 'advanced',
    code: `// Wave Propagation
// Advanced animation with mathematical wave functions!

console.log("Creating wave grid...");

const gridSize = 12;
const spacing = 30;
const brickMap = new Map();  // Store positions to IDs

// Create grid
for (let x = 0; x < gridSize; x++) {
  for (let z = 0; z < gridSize; z++) {
    const id = createBrick({
      color: '#4488ff',
      position: {
        x: (x - gridSize/2) * spacing,
        y: 24,
        z: (z - gridSize/2) * spacing
      },
      dimensions: { x: 1, z: 1 }
    });

    if (id) {
      brickMap.set(\`\${x},\${z}\`, id);
    }
  }
}

console.log(\`Grid created: \${brickMap.size} bricks\`);
await wait(500);

// Wave propagation simulation
console.log("Starting wave propagation...");

const waveSpeed = 0.5;
const waveAmplitude = 50;
const frames = 60;

for (let frame = 0; frame < frames; frame++) {
  const time = frame * 0.1;

  const animations = [];

  for (let x = 0; x < gridSize; x++) {
    for (let z = 0; z < gridSize; z++) {
      const id = brickMap.get(\`\${x},\${z}\`);
      if (!id) continue;

      // Calculate wave height using 2D wave equation
      const centerX = gridSize / 2;
      const centerZ = gridSize / 2;
      const distance = Math.sqrt(
        Math.pow(x - centerX, 2) + Math.pow(z - centerZ, 2)
      );

      const waveHeight = waveAmplitude *
        Math.sin(distance * waveSpeed - time * 2) *
        Math.exp(-distance * 0.1);  // Damping

      const newY = 24 + waveHeight;

      // Color based on height
      const hue = 200 + (waveHeight / waveAmplitude) * 60;

      animations.push(
        animate(id)
          .move({
            x: (x - gridSize/2) * spacing,
            y: newY,
            z: (z - gridSize/2) * spacing
          })
          .color(\`hsl(\${hue}, 70%, 60%)\`)
          .run()
      );
    }
  }

  await Promise.all(animations);
  await wait(50);
}

console.log("Wave propagation complete!");

// Reset to flat
console.log("Resetting grid...");
const resetAnimations = [];

for (let x = 0; x < gridSize; x++) {
  for (let z = 0; z < gridSize; z++) {
    const id = brickMap.get(\`\${x},\${z}\`);
    if (!id) continue;

    resetAnimations.push(
      animate(id)
        .move({
          x: (x - gridSize/2) * spacing,
          y: 24,
          z: (z - gridSize/2) * spacing
        })
        .color('#4488ff')
        .run()
    );
  }
}

await Promise.all(resetAnimations);
console.log("Grid reset complete!");`
  },

  'advanced-fractal-tree': {
    name: 'Fractal Tree',
    description: 'Generate a 3D fractal tree structure',
    difficulty: 'advanced',
    code: `// Fractal Tree Generator
// Recursive fractal generation with collision awareness!

async function generateBranch(startPos, angle, length, depth, maxDepth) {
  if (depth > maxDepth) return;

  // Calculate end position
  const endX = startPos.x + Math.cos(angle) * length;
  const endZ = startPos.z + Math.sin(angle) * length;
  const endY = startPos.y + length * 0.5;  // Grow upward

  // Create branch segments
  const segments = Math.max(2, Math.floor(length / 15));

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const pos = {
      x: startPos.x + (endX - startPos.x) * t,
      y: startPos.y + (endY - startPos.y) * t,
      z: startPos.z + (endZ - startPos.z) * t
    };

    // Size decreases with depth
    const size = Math.max(1, 3 - depth);

    // Color: brown for trunk, green for leaves
    const isLeaf = depth >= maxDepth - 1;
    const hue = isLeaf ? 120 : 30;
    const lightness = isLeaf ? 50 : 30;

    const test = testPosition(pos, { x: size, z: size });
    if (!test.collision) {
      createBrick({
        color: \`hsl(\${hue}, 60%, \${lightness}%)\`,
        position: pos,
        dimensions: { x: size, z: size }
      });

      await wait(20);
    }
  }

  // Recursively create child branches
  if (depth < maxDepth) {
    const newLength = length * 0.7;
    const angleSpread = Math.PI / 4;

    // Create 3 child branches
    await generateBranch(
      { x: endX, y: endY, z: endZ },
      angle - angleSpread,
      newLength,
      depth + 1,
      maxDepth
    );

    await generateBranch(
      { x: endX, y: endY, z: endZ },
      angle,
      newLength,
      depth + 1,
      maxDepth
    );

    await generateBranch(
      { x: endX, y: endY, z: endZ },
      angle + angleSpread,
      newLength,
      depth + 1,
      maxDepth
    );
  }
}

console.log("Growing fractal tree...");

const startPos = { x: 0, y: 24, z: 0 };
const initialAngle = Math.PI / 2;  // Point up
const initialLength = 60;
const maxDepth = 4;

await generateBranch(startPos, initialAngle, initialLength, 0, maxDepth);

console.log("Tree growth complete!");

// Count leaves and branches
const treeBounds = {
  min: { x: -150, y: 20, z: -150 },
  max: { x: 150, y: 200, z: 150 }
};

const allParts = getBricksInRegion(treeBounds);
console.log(\`Tree stats: \${allParts.length} total parts\`);`
  },

  'advanced-collision-resolver': {
    name: 'Automatic Collision Resolver',
    description: 'Automatically resolve overlapping bricks',
    difficulty: 'advanced',
    code: `// Automatic Collision Resolver
// Detect and automatically resolve all collisions!

console.log("Creating overlapping bricks intentionally...");

// Create some overlapping bricks
const testBricks = [];

for (let i = 0; i < 10; i++) {
  const x = Math.random() * 100 - 50;
  const z = Math.random() * 100 - 50;

  const id = createBrick({
    color: '#ff0000',
    position: { x, y: 24, z },
    dimensions: { x: 2, z: 2 },
    force: true  // Force overlaps
  });

  if (id) testBricks.push(id);
}

await wait(500);

// Find all collisions
console.log("\\nScanning for collisions...");
const collisionMap = new Map();

for (const id of testBricks) {
  const collisions = getCollisions(id);
  if (collisions.length > 0) {
    collisionMap.set(id, collisions);
    console.log(\`Brick \${id}: \${collisions.length} collision(s)\`);
  }
}

console.log(\`\\nFound \${collisionMap.size} bricks with collisions\`);

// Resolve collisions by moving bricks
console.log("Resolving collisions...");

for (const [id, collisions] of collisionMap.entries()) {
  const brickInfo = brick(id);
  if (!brickInfo) continue;

  // Find free position
  const freePos = findFreePosition(
    brickInfo.position,
    brickInfo.dimensions,
    { maxRadius: 10, spacing: 30 }
  );

  if (freePos) {
    console.log(\`Moving brick \${id} to free position\`);

    // Animate the resolution
    await animate(id)
      .color('#ffff00')  // Yellow during move
      .wait(100)
      .move(freePos)
      .wait(200)
      .color('#00ff00')  // Green when resolved
      .run();
  } else {
    console.log(\`Could not find free position for brick \${id}\`);
    await animate(id).color('#ff00ff').run();  // Magenta = failed
  }

  await wait(200);
}

// Verify resolution
console.log("\\nVerifying collision resolution...");
let remainingCollisions = 0;

for (const id of testBricks) {
  const collisions = getCollisions(id);
  remainingCollisions += collisions.length;
}

if (remainingCollisions === 0) {
  console.log("✓ All collisions resolved successfully!");
} else {
  console.log(\`⚠ \${remainingCollisions} collision(s) remain\`);
}

console.log("Collision resolution complete!");`
  },

  'advanced-choreographed-dance': {
    name: 'Choreographed Dance',
    description: 'Complex synchronized animation choreography',
    difficulty: 'advanced',
    code: `// Choreographed Dance
// Advanced choreography with formations and transitions!

console.log("Creating dance troupe...");

const dancers = [];
const formations = {
  line: [],
  circle: [],
  grid: []
};

// Create dancers in a line
for (let i = 0; i < 8; i++) {
  const id = createBrick({
    color: \`hsl(\${i * 45}, 80%, 60%)\`,
    position: { x: i * 40 - 140, y: 24, z: 0 },
    dimensions: { x: 1, z: 1 }
  });

  if (id) {
    dancers.push(id);
    formations.line.push({ x: i * 40 - 140, y: 24, z: 0 });
  }
}

// Calculate circle formation
const radius = 80;
for (let i = 0; i < dancers.length; i++) {
  const angle = (i / dancers.length) * Math.PI * 2;
  formations.circle.push({
    x: Math.cos(angle) * radius,
    y: 24,
    z: Math.sin(angle) * radius
  });
}

// Calculate grid formation
const gridSize = Math.ceil(Math.sqrt(dancers.length));
for (let i = 0; i < dancers.length; i++) {
  const row = Math.floor(i / gridSize);
  const col = i % gridSize;
  formations.grid.push({
    x: col * 50 - 75,
    y: 24,
    z: row * 50 - 75
  });
}

await wait(1000);

// Dance sequence
console.log("Starting choreography...");

// Movement 1: Jump wave
console.log("Movement 1: Jump wave");
for (let i = 0; i < dancers.length; i++) {
  const id = dancers[i];
  const pos = formations.line[i];

  animate(id)
    .moveBy({ x: 0, y: 50, z: 0 })
    .wait(200)
    .moveBy({ x: 0, y: -50, z: 0 })
    .run();

  await wait(100);
}

await wait(500);

// Movement 2: Transition to circle
console.log("Movement 2: Circle formation");
await Promise.all(
  dancers.map((id, i) =>
    animate(id)
      .move(formations.circle[i])
      .run()
  )
);

await wait(500);

// Movement 3: Spin in circle
console.log("Movement 3: Synchronized spin");
for (let frame = 0; frame < 30; frame++) {
  const angle = (frame / 30) * Math.PI * 2;

  await Promise.all(
    dancers.map((id, i) => {
      const baseAngle = (i / dancers.length) * Math.PI * 2;
      const newAngle = baseAngle + angle;

      return animate(id)
        .move({
          x: Math.cos(newAngle) * radius,
          y: 24 + Math.sin(angle * 3) * 20,  // Bob up and down
          z: Math.sin(newAngle) * radius
        })
        .color(\`hsl(\${(i * 45 + frame * 12) % 360}, 80%, 60%)\`)
        .run();
    })
  );

  await wait(50);
}

await wait(500);

// Movement 4: Transition to grid
console.log("Movement 4: Grid formation");
await Promise.all(
  dancers.map((id, i) =>
    animate(id)
      .move(formations.grid[i])
      .run()
  )
);

await wait(500);

// Movement 5: Color cascade
console.log("Movement 5: Color cascade");
for (let wave = 0; wave < 3; wave++) {
  for (let i = 0; i < dancers.length; i++) {
    const id = dancers[i];

    animate(id)
      .color('#ffffff')
      .wait(100)
      .color(\`hsl(\${i * 45}, 80%, 60%)\`)
      .run();

    await wait(50);
  }
}

await wait(500);

// Finale: Return to line
console.log("Finale: Return to line");
await Promise.all(
  dancers.map((id, i) =>
    animate(id)
      .move(formations.line[i])
      .color(\`hsl(\${i * 45}, 80%, 60%)\`)
      .run()
  )
);

// Final bow
await wait(500);
await Promise.all(
  dancers.map(id =>
    animate(id)
      .moveBy({ x: 0, y: -5, z: 0 })
      .wait(500)
      .moveBy({ x: 0, y: 5, z: 0 })
      .run()
  )
);

console.log("Choreography complete! 🎭");`
  }
};
