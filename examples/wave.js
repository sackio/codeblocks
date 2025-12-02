// Wave Effect
// Creates an animated wave using cylinders

const width = 12;
const depth = 8;
const spacing = 25;
const baseColor = '#00aaff';

for (let x = 0; x < width; x++) {
  for (let z = 0; z < depth; z++) {
    const height = Math.sin((x + z) / 2) * 3 + 4;
    const brightness = Math.floor(155 + Math.sin((x + z) / 2) * 100);
    const color = `#00${brightness.toString(16)}ff`;

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
}
