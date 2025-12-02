// Spiral Tower
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
    position: { x: 0, y: i * 24, z: 0 },
    rotation: rotation,
    dimensions: { x: 3, z: 1 }
  });

  await wait(200);
}
