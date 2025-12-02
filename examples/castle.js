// Simple Castle
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
}
