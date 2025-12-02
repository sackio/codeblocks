// Rainbow Wall
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
}
