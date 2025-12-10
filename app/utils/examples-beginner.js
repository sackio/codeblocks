/**
 * BEGINNER LEVEL EXAMPLES
 * Skill Level: Ages 5-10, AI agents, absolute beginners
 *
 * Features demonstrated:
 * - Simple createBrick() with minimal parameters
 * - Automatic collision prevention (safe by default)
 * - Basic animate() usage with color and movement
 * - Sequential brick creation
 * - Simple loops and waits
 */

export const beginnerExamples = {
  'beginner-rainbow-stack': {
    name: 'Rainbow Stack',
    description: 'Stack colorful bricks safely - they won\'t overlap!',
    difficulty: 'beginner',
    code: `// Rainbow Stack - Build colorful bricks!
// Watch them stack without overlapping!

const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

for (let i = 0; i < 6; i++) {
  createBrick({
    color: colors[i],
    position: { x: 0, y: i * 33 + 24, z: 0 },
    dimensions: { x: 2, z: 2 }
  });

  await wait(300);
}

// They're all safely stacked - no overlaps!`
  },

  'beginner-color-dance': {
    name: 'Color Dance',
    description: 'Make a brick change colors with animations!',
    difficulty: 'beginner',
    code: `// Color Dance - Watch the brick change colors!
// Using the new animate() function!

const brick1 = createBrick({
  color: 'red',
  position: { x: 0, y: 24, z: 0 },
  dimensions: { x: 2, z: 2 }
});

// Chain animations together!
await animate(brick1)
  .color('blue')
  .wait(500)
  .color('green')
  .wait(500)
  .color('yellow')
  .wait(500)
  .color('purple')
  .wait(500)
  .color('orange')
  .wait(500)
  .run();

// That was fun!`
  },

  'beginner-moving-brick': {
    name: 'Moving Brick',
    description: 'Watch a brick move around!',
    difficulty: 'beginner',
    code: `// Moving Brick - Make it dance around!

const dancer = createBrick({
  color: '#ff6b35',
  position: { x: 0, y: 24, z: 0 },
  dimensions: { x: 2, z: 2 }
});

// Move in a square!
await animate(dancer)
  .move({ x: 50, y: 24, z: 0 })
  .wait(400)
  .move({ x: 50, y: 24, z: 50 })
  .wait(400)
  .move({ x: 0, y: 24, z: 50 })
  .wait(400)
  .move({ x: 0, y: 24, z: 0 })
  .wait(400)
  .run();

// Square complete!`
  },

  'beginner-collision-demo': {
    name: 'Collision Safety',
    description: 'See how bricks prevent overlaps automatically!',
    difficulty: 'beginner',
    code: `// Collision Safety Demo
// The second brick won't be created - position is occupied!

const brick1 = createBrick({
  color: 'red',
  position: { x: 0, y: 24, z: 0 },
  dimensions: { x: 2, z: 2 }
});

console.log("Created first brick:", brick1);

await wait(500);

// Try to create another at the same spot
const brick2 = createBrick({
  color: 'blue',
  position: { x: 0, y: 24, z: 0 },
  dimensions: { x: 2, z: 2 }
});

console.log("Second brick (should be null):", brick2);

// Check the console - brick2 is null! Collision prevented!

await wait(500);

// But we can force it if we really want to:
const brick3 = createBrick({
  color: 'green',
  position: { x: 0, y: 24, z: 0 },
  dimensions: { x: 2, z: 2 },
  force: true  // Override safety
});

console.log("Forced brick:", brick3);`
  },

  'beginner-simple-tower': {
    name: 'Simple Tower',
    description: 'Build a tower one brick at a time!',
    difficulty: 'beginner',
    code: `// Simple Tower - Stack them high!

const colors = ['#ff0000', '#ff7700', '#ffdd00', '#00ff00', '#0088ff', '#8800ff'];

for (let i = 0; i < 10; i++) {
  const color = colors[i % colors.length];

  createBrick({
    color: color,
    position: { x: 0, y: i * 33 + 24, z: 0 },
    dimensions: { x: 2, z: 2 }
  });

  await wait(200);
}

// Tower complete!`
  },

  'beginner-two-towers': {
    name: 'Two Towers',
    description: 'Build two towers side by side!',
    difficulty: 'beginner',
    code: `// Two Towers - Build them together!

for (let i = 0; i < 6; i++) {
  // Tower 1 (red)
  createBrick({
    color: '#ff0000',
    position: { x: 0, y: i * 33 + 24, z: 0 },
    dimensions: { x: 2, z: 2 }
  });

  // Tower 2 (blue)
  createBrick({
    color: '#0000ff',
    position: { x: 75, y: i * 33 + 24, z: 0 },
    dimensions: { x: 2, z: 2 }
  });

  await wait(300);
}

// Twins!`
  },

  'beginner-staircase': {
    name: 'Staircase',
    description: 'Build stairs going up!',
    difficulty: 'beginner',
    code: `// Staircase - Climb the steps!

for (let i = 0; i < 8; i++) {
  createBrick({
    color: '#888888',
    position: {
      x: i * 25,      // Move right each step
      y: i * 33 + 24, // Move up each step
      z: 0
    },
    dimensions: { x: 1, z: 2 }
  });

  await wait(200);
}

// Ready to climb!`
  },

  'beginner-color-row': {
    name: 'Color Row',
    description: 'Make a row of different colored bricks!',
    difficulty: 'beginner',
    code: `// Color Row - Paint a rainbow!

const colors = [
  'red', 'orange', 'yellow', 'green',
  'blue', 'purple', 'pink', 'cyan'
];

for (let i = 0; i < colors.length; i++) {
  createBrick({
    color: colors[i],
    position: { x: i * 50, y: 24, z: 0 },
    dimensions: { x: 2, z: 2 }
  });

  await wait(200);
}

// Beautiful!`
  },

  'beginner-bouncing-brick': {
    name: 'Bouncing Brick',
    description: 'Watch it bounce up and down!',
    difficulty: 'beginner',
    code: `// Bouncing Brick - Boing boing!

const bouncer = createBrick({
  color: '#ff6b35',
  position: { x: 0, y: 24, z: 0 },
  dimensions: { x: 2, z: 2 }
});

// Bounce 5 times!
for (let i = 0; i < 5; i++) {
  await animate(bouncer)
    .move({ x: 0, y: 100, z: 0 })  // Jump up!
    .wait(300)
    .move({ x: 0, y: 24, z: 0 })   // Fall down!
    .wait(300)
    .run();
}

// Whee!`
  },

  'beginner-traffic-light': {
    name: 'Traffic Light',
    description: 'Build a traffic light that changes colors!',
    difficulty: 'beginner',
    code: `// Traffic Light - Red, Yellow, Green!

// Build the lights
const red = createBrick({
  color: '#ff0000',
  position: { x: 0, y: 24, z: 0 },
  dimensions: { x: 2, z: 2 }
});

const yellow = createBrick({
  color: '#ffdd00',
  position: { x: 0, y: 57, z: 0 },
  dimensions: { x: 2, z: 2 }
});

const green = createBrick({
  color: '#00ff00',
  position: { x: 0, y: 90, z: 0 },
  dimensions: { x: 2, z: 2 }
});

await wait(500);

// Make them blink!
for (let i = 0; i < 3; i++) {
  // Red light
  await animate(red).color('#ff0000').run();
  await animate(yellow).color('#444400').run();
  await animate(green).color('#004400').run();
  await wait(1000);

  // Yellow light
  await animate(red).color('#440000').run();
  await animate(yellow).color('#ffdd00').run();
  await animate(green).color('#004400').run();
  await wait(500);

  // Green light
  await animate(red).color('#440000').run();
  await animate(yellow).color('#444400').run();
  await animate(green).color('#00ff00').run();
  await wait(1000);
}

// Cycle complete!`
  }
};
