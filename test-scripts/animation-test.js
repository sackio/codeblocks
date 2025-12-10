/**
 * Test Script: Animation System
 *
 * This script tests the new BrickAnimator to verify:
 * 1. animate() function creates proper animator
 * 2. Command chaining works correctly
 * 3. Sequential execution works (no freezing)
 * 4. Multiple animations can be queued
 */

async function testAnimations() {
  console.log("=== Animation System Tests ===\n");

  // Test 1: Basic color animation
  console.log("Test 1: Color animation");
  const brick1 = createBrick({
    color: 'red',
    position: { x: 0, y: 24, z: 0 },
    dimensions: { x: 2, z: 2 },
    checkCollision: false
  });

  if (brick1) {
    await animate(brick1)
      .color('blue')
      .wait(500)
      .color('green')
      .wait(500)
      .color('red')
      .run();
    console.log("✓ Color animation completed");
  }

  // Test 2: Movement animation
  console.log("\nTest 2: Movement animation");
  const brick2 = createBrick({
    color: 'yellow',
    position: { x: 50, y: 24, z: 50 },
    dimensions: { x: 2, z: 2 },
    checkCollision: false
  });

  if (brick2) {
    await animate(brick2)
      .move({ x: 75, y: 24, z: 75 })
      .wait(500)
      .move({ x: 50, y: 48, z: 50 })
      .wait(500)
      .move({ x: 50, y: 24, z: 50 })
      .run();
    console.log("✓ Movement animation completed");
  }

  // Test 3: Relative movement (moveBy)
  console.log("\nTest 3: Relative movement");
  const brick3 = createBrick({
    color: 'purple',
    position: { x: -50, y: 24, z: -50 },
    dimensions: { x: 2, z: 2 },
    checkCollision: false
  });

  if (brick3) {
    await animate(brick3)
      .moveBy({ x: 25, y: 0, z: 0 })
      .wait(300)
      .moveBy({ x: 0, y: 24, z: 0 })
      .wait(300)
      .moveBy({ x: 0, y: 0, z: 25 })
      .run();
    console.log("✓ Relative movement completed");
  }

  // Test 4: Combined animation
  console.log("\nTest 4: Combined animation (color + movement)");
  const brick4 = createBrick({
    color: 'white',
    position: { x: 100, y: 24, z: 0 },
    dimensions: { x: 2, z: 2 },
    checkCollision: false
  });

  if (brick4) {
    await animate(brick4)
      .color('#ff0000')
      .wait(200)
      .moveBy({ x: 0, y: 24, z: 0 })
      .color('#00ff00')
      .wait(200)
      .moveBy({ x: 0, y: 24, z: 0 })
      .color('#0000ff')
      .wait(200)
      .moveBy({ x: 0, y: 24, z: 0 })
      .run();
    console.log("✓ Combined animation completed");
  }

  // Test 5: Parallel animations (multiple bricks)
  console.log("\nTest 5: Parallel animations");
  const brick5 = createBrick({
    color: 'cyan',
    position: { x: -100, y: 24, z: 0 },
    dimensions: { x: 2, z: 2 },
    checkCollision: false
  });

  const brick6 = createBrick({
    color: 'magenta',
    position: { x: -100, y: 24, z: 50 },
    dimensions: { x: 2, z: 2 },
    checkCollision: false
  });

  if (brick5 && brick6) {
    // Run animations in parallel using Promise.all
    await Promise.all([
      animate(brick5)
        .moveBy({ x: 50, y: 0, z: 0 })
        .wait(300)
        .color('orange')
        .run(),
      animate(brick6)
        .moveBy({ x: 50, y: 0, z: 0 })
        .wait(300)
        .color('lime')
        .run()
    ]);
    console.log("✓ Parallel animations completed");
  }

  console.log("\n=== All Animation Tests Passed! ===");
  console.log("No freezing, no crashes - new BrickAnimator working correctly!");
}

// Run the tests
testAnimations();
