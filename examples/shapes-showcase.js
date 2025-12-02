// Shapes Showcase
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

const spacing = 50;

for (let i = 0; i < shapes.length; i++) {
  const x = (i % 5) * spacing;
  const z = Math.floor(i / 5) * spacing;

  createBrick({
    type: shapes[i],
    color: colors[i % colors.length],
    position: { x, y: 24, z },
    dimensions: { x: 2, z: 2 }
  });

  await wait(150);
}
