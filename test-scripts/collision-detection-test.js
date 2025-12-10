/**
 * Test Script: Collision Detection
 *
 * This script tests the new collision detection system to verify:
 * 1. checkCollision parameter prevents overlapping bricks by default
 * 2. force parameter allows override when needed
 * 3. testPosition() works correctly
 * 4. getCollisions() detects overlapping bricks
 */

// Test 1: Create two bricks at the same position - second should fail
console.log("=== Test 1: Collision Prevention ===");
const brick1 = createBrick({
  color: 'red',
  position: { x: 0, y: 24, z: 0 },
  dimensions: { x: 2, z: 2 }
});
console.log("Created brick1:", brick1);

const brick2 = createBrick({
  color: 'blue',
  position: { x: 0, y: 24, z: 0 },
  dimensions: { x: 2, z: 2 }
  // checkCollision defaults to true, so this should fail
});
console.log("Attempted brick2 (should be null):", brick2);

// Test 2: Force placement even with collision
console.log("\n=== Test 2: Force Override ===");
const brick3 = createBrick({
  color: 'green',
  position: { x: 0, y: 24, z: 0 },
  dimensions: { x: 2, z: 2 },
  force: true // Override collision detection
});
console.log("Created brick3 with force:", brick3);

// Test 3: Test position before placing
console.log("\n=== Test 3: testPosition() ===");
const testResult = testPosition(
  { x: 50, y: 24, z: 50 },
  { x: 2, z: 2 }
);
console.log("Position (50, 24, 50) free?", !testResult.collision);

const testResult2 = testPosition(
  { x: 0, y: 24, z: 0 },
  { x: 2, z: 2 }
);
console.log("Position (0, 24, 0) free?", !testResult2.collision);
console.log("Colliding bricks:", testResult2.collidingBricks.length);

// Test 4: Get collisions for a brick
console.log("\n=== Test 4: getCollisions() ===");
if (brick1) {
  const collisions = getCollisions(brick1);
  console.log("Brick1 has", collisions.length, "collision(s)");
  collisions.forEach(c => {
    console.log("  - Collides with brick:", c.id);
  });
}

// Test 5: Find free position
console.log("\n=== Test 5: findFreePosition() ===");
const freePos = findFreePosition(
  { x: 0, y: 24, z: 0 },
  { x: 2, z: 2 }
);
console.log("Found free position:", freePos);

// Test 6: Create brick at free position
if (freePos) {
  const brick4 = createBrick({
    color: 'yellow',
    position: freePos,
    dimensions: { x: 2, z: 2 }
  });
  console.log("Created brick4 at free position:", brick4);
}

console.log("\n=== Collision Detection Tests Complete ===");
