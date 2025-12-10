/**
 * Test Script: Collision API Methods
 *
 * This script tests the new collision-related API methods:
 * 1. getBounds() - Get AABB bounding box
 * 2. getCenter() - Get center position
 * 3. getVolume() - Calculate volume
 * 4. getBricksInRegion() - Query by region
 */

console.log("=== Collision API Methods Tests ===\n");

// Create test bricks
console.log("Creating test bricks...");
const brick1 = createBrick({
  color: 'red',
  position: { x: 0, y: 24, z: 0 },
  dimensions: { x: 2, z: 2 },
  checkCollision: false
});

const brick2 = createBrick({
  color: 'blue',
  position: { x: 50, y: 24, z: 0 },
  dimensions: { x: 4, z: 2 }, // Different size
  checkCollision: false
});

const brick3 = createBrick({
  color: 'green',
  position: { x: 0, y: 48, z: 0 },
  dimensions: { x: 2, z: 2 },
  checkCollision: false
});

// Test 1: getBounds()
console.log("\n=== Test 1: getBounds() ===");
if (brick1) {
  const bounds1 = getBounds(brick1);
  console.log("Brick1 bounds:", bounds1);
  console.log("  Min:", bounds1.min);
  console.log("  Max:", bounds1.max);
}

if (brick2) {
  const bounds2 = getBounds(brick2);
  console.log("Brick2 bounds (larger brick):", bounds2);
  console.log("  Min:", bounds2.min);
  console.log("  Max:", bounds2.max);
}

// Test 2: getCenter()
console.log("\n=== Test 2: getCenter() ===");
if (brick1) {
  const center1 = getCenter(brick1);
  console.log("Brick1 center:", center1);
}

if (brick2) {
  const center2 = getCenter(brick2);
  console.log("Brick2 center:", center2);
}

// Test 3: getVolume()
console.log("\n=== Test 3: getVolume() ===");
if (brick1) {
  const volume1 = getVolume(brick1);
  console.log("Brick1 volume:", volume1, "cubic units");
}

if (brick2) {
  const volume2 = getVolume(brick2);
  console.log("Brick2 volume:", volume2, "cubic units (should be 2x brick1)");
}

// Test 4: getBricksInRegion()
console.log("\n=== Test 4: getBricksInRegion() ===");

// Define a region that includes brick1 and brick3 but not brick2
const region1 = {
  min: { x: -50, y: 0, z: -50 },
  max: { x: 50, y: 50, z: 50 }
};
const bricksInRegion1 = getBricksInRegion(region1);
console.log("Region 1 contains", bricksInRegion1.length, "brick(s)");
bricksInRegion1.forEach(b => {
  console.log("  - Brick:", b.id, "at position", b.position);
});

// Define a smaller region that only includes brick1
const region2 = {
  min: { x: -25, y: 0, z: -25 },
  max: { x: 25, y: 30, z: 25 }
};
const bricksInRegion2 = getBricksInRegion(region2);
console.log("\nRegion 2 (smaller) contains", bricksInRegion2.length, "brick(s)");
bricksInRegion2.forEach(b => {
  console.log("  - Brick:", b.id, "at position", b.position);
});

// Test 5: Practical use case - Find all bricks in a layer
console.log("\n=== Test 5: Find all bricks at Y level ===");
const layerBounds = {
  min: { x: -1000, y: 20, z: -1000 },
  max: { x: 1000, y: 28, z: 1000 }
};
const layer1Bricks = getBricksInRegion(layerBounds);
console.log("Y=24 layer contains", layer1Bricks.length, "brick(s)");

// Test 6: Error handling
console.log("\n=== Test 6: Error Handling ===");
const invalidBounds = getBounds("nonexistent-id");
console.log("getBounds('nonexistent-id'):", invalidBounds, "(should be null)");

const invalidCenter = getCenter("nonexistent-id");
console.log("getCenter('nonexistent-id'):", invalidCenter, "(should be null)");

const invalidVolume = getVolume("nonexistent-id");
console.log("getVolume('nonexistent-id'):", invalidVolume, "(should be null)");

console.log("\n=== Collision API Tests Complete ===");
