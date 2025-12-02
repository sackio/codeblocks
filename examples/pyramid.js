// Pyramid
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
}
