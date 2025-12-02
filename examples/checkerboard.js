// Checkerboard Pattern
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
}
