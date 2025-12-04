# CodeBlocks Tutorial for Kids! 🎮

Welcome to CodeBlocks! You're about to learn how to build awesome 3D structures using code. It's like playing with LEGO bricks, but on your computer!

## What is CodeBlocks?

CodeBlocks lets you create 3D buildings, towers, cities, and anything you can imagine using JavaScript code. Instead of clicking to place bricks, you write simple commands that tell the computer what to build.

## Your First Brick! 🧱

Let's start super simple. Copy this code and click "Run":

```javascript
createBrick({
  color: '#ff0000',
  position: { x: 0, y: 24, z: 0 }
});
```

**Congratulations!** You just created your first red brick! 🎉

### What does this code mean?

- `createBrick` - This tells the computer "I want to make a brick"
- `color: '#ff0000'` - This makes it red (more colors below!)
- `position: { x: 0, y: 24, z: 0 }` - This is WHERE the brick goes

Think of position like this:
- **x** = left and right (like walking sideways)
- **y** = up and down (like jumping or climbing)
- **z** = forward and backward (like walking forward)

## Making a Stack 📚

Let's stack 3 bricks on top of each other:

```javascript
createBrick({
  color: '#ff0000',
  position: { x: 0, y: 24, z: 0 }
});

createBrick({
  color: '#00ff00',
  position: { x: 0, y: 48, z: 0 }
});

createBrick({
  color: '#0000ff',
  position: { x: 0, y: 72, z: 0 }
});
```

Notice how **y** goes up by 24 each time? That's because each brick is 24 units tall!

**Pro Tip:** You can use the constant `BRICK_HEIGHT` instead of remembering 24:
```javascript
createBrick({
  color: '#ff0000',
  position: { x: 0, y: BRICK_HEIGHT, z: 0 }
});
```

## Rainbow Colors 🌈

Here are some fun colors you can use:

- Red: `'#ff0000'`
- Orange: `'#ff6b35'`
- Yellow: `'#ffff00'`
- Green: `'#00ff00'`
- Blue: `'#0000ff'`
- Purple: `'#8800ff'`
- Pink: `'#ff69b4'`
- White: `'#ffffff'`
- Black: `'#000000'`

Try making a rainbow tower with different colors!

## Using Loops (Make Lots of Bricks Fast!) 🔁

What if you want to make 10 bricks? You don't want to copy the same code 10 times! Let's use a **loop**:

```javascript
clearScene(); // Clear everything first

for (let i = 0; i < 10; i++) {
  createBrick({
    color: '#ff6b35',
    position: { x: 0, y: i * BRICK_HEIGHT, z: 0 }
  });
}
```

**Wow!** You just made a 10-brick tower with only a few lines of code!

### How does the loop work?

- `for (let i = 0; i < 10; i++)` - This means "do this 10 times"
- `i` starts at 0, then becomes 1, 2, 3... up to 9
- `i * BRICK_HEIGHT` - Multiply `i` by 24 to stack bricks higher

## Make it Animated! ⏱️

Add `await wait()` to see bricks appear one by one:

```javascript
clearScene();

for (let i = 0; i < 10; i++) {
  createBrick({
    color: '#ff6b35',
    position: { x: 0, y: i * BRICK_HEIGHT, z: 0 }
  });
  await wait(200); // Wait 200 milliseconds before next brick
}
```

Now watch your tower grow brick by brick!

## Different Brick Types 🎨

You can make different shaped bricks! Try these:

### Cylinder (Round bricks)
```javascript
createBrick({
  type: 'cylinder',
  color: '#ffff00',
  position: { x: 0, y: 24, z: 0 }
});
```

### Cone (Pointy top!)
```javascript
createBrick({
  type: 'cone',
  color: '#ff0000',
  position: { x: 0, y: 24, z: 0 }
});
```

### Slope (For roofs!)
```javascript
createBrick({
  type: 'slope45',
  color: '#8800ff',
  position: { x: 0, y: 24, z: 0 }
});
```

All brick types:
- `'rectangle'` - Normal brick (default)
- `'cylinder'` - Round brick
- `'cone'` - Pointy cone
- `'slope45'` - Steep slope
- `'slope33'` - Gentle slope
- `'arch'` - Archway
- `'plate'` - Thin flat piece

## Making Bigger Bricks 📏

Want a HUGE brick? Change the `dimensions`:

```javascript
createBrick({
  color: '#00ff00',
  position: { x: 0, y: 24, z: 0 },
  dimensions: { x: 4, z: 4 } // 4x4 instead of 2x2!
});
```

- `x` = width (how wide left-to-right)
- `z` = length (how long front-to-back)
- Default is `{ x: 2, z: 2 }` (a 2x2 brick)

## Spacing Bricks Apart 📐

Want bricks side by side instead of stacked? Change the **x** or **z** position:

```javascript
clearScene();

// Three bricks in a row
createBrick({
  color: '#ff0000',
  position: { x: 0, y: 24, z: 0 }
});

createBrick({
  color: '#00ff00',
  position: { x: 25, y: 24, z: 0 } // Move right
});

createBrick({
  color: '#0000ff',
  position: { x: 50, y: 24, z: 0 } // Move more right
});
```

**Pro Tip:** Use `BRICK_SPACING` (which is 25) for perfect spacing:
```javascript
position: { x: i * BRICK_SPACING, y: 24, z: 0 }
```

## Preventing Overlapping Bricks! ⚠️

**Important!** Don't put two bricks in the same spot or they'll overlap and look weird!

### Check if a spot is empty first:
```javascript
const pos = { x: 0, y: 24, z: 0 };

if (!isPositionOccupied(pos)) {
  createBrick({ position: pos, color: '#ff0000' });
} else {
  console.log('Oops! There is already a brick there!');
}
```

### Find the next empty spot automatically:
```javascript
clearScene();

for (let i = 0; i < 20; i++) {
  const nextSpot = getNextFreePosition();

  if (nextSpot) {
    createBrick({
      position: nextSpot,
      color: '#ff6b35'
    });
  }
}
```

This will place 20 bricks in a nice pattern without any overlaps!

## Camera Views 📷

Change how you look at your creation:

```javascript
setTopView();      // Look from above
setFrontView();    // Look from the front
setSideView();     // Look from the side
setIsometricView(); // Cool 3D angle (default)
```

Try building something, then use different views to see it from all angles!

## Fun Challenge Ideas! 🏆

### Challenge 1: Rainbow Tower
Make a 7-brick tower with all the colors of the rainbow:
- Red, Orange, Yellow, Green, Blue, Purple, Pink

### Challenge 2: Checkerboard Pattern
Create a checkerboard floor using black and white bricks. Hint: Use two loops!

### Challenge 3: Pyramid
Build a pyramid that gets smaller as it goes up. Hint: Use a loop and change dimensions!

### Challenge 4: House
Build a simple house with:
- 4 walls made of rectangular bricks
- A cone on top as a roof
- Use different colors!

### Challenge 5: Spiral Tower
Make bricks go up AND around in a spiral. Hint: Use rotation!

## Advanced Tips 🚀

### Rotation
Spin bricks using `rotation`:

```javascript
createBrick({
  color: '#ff0000',
  position: { x: 0, y: 24, z: 0 },
  rotation: Math.PI / 4 // Spin 45 degrees
});
```

- `Math.PI / 4` = 45 degrees
- `Math.PI / 2` = 90 degrees
- `Math.PI` = 180 degrees

### Naming Your Bricks
Give bricks names with `id` so you can find them later:

```javascript
createBrick({
  id: 'my-special-brick',
  color: '#ff0000',
  position: { x: 0, y: 24, z: 0 }
});

// Later, find it:
const myBrick = findBrickById('my-special-brick');
```

### Snap to Grid
Make sure positions line up perfectly:

```javascript
const messyPosition = { x: 13, y: 28, z: 42 };
const nicePosition = snapToGrid(messyPosition);
// Result: { x: 0, y: 24, z: 50 }
```

## Example Projects 🎪

### Simple House
```javascript
clearScene();

// Floor
for (let x = 0; x < 4; x++) {
  for (let z = 0; z < 4; z++) {
    createBrick({
      type: 'plate',
      color: '#8B4513',
      position: {
        x: x * BRICK_SPACING,
        y: 0,
        z: z * BRICK_SPACING
      }
    });
    await wait(50);
  }
}

// Walls
const wallPositions = [
  // Front wall
  { x: 0, y: 24, z: 0 },
  { x: 25, y: 24, z: 0 },
  { x: 50, y: 24, z: 0 },
  { x: 75, y: 24, z: 0 },
  // Back wall
  { x: 0, y: 24, z: 75 },
  { x: 25, y: 24, z: 75 },
  { x: 50, y: 24, z: 75 },
  { x: 75, y: 24, z: 75 },
  // Left wall
  { x: 0, y: 24, z: 25 },
  { x: 0, y: 24, z: 50 },
  // Right wall
  { x: 75, y: 24, z: 25 },
  { x: 75, y: 24, z: 50 },
];

for (const pos of wallPositions) {
  createBrick({
    color: '#ff6b35',
    position: pos
  });
  await wait(100);
}

// Roof
createBrick({
  type: 'cone',
  color: '#ff0000',
  position: { x: 37, y: 48, z: 37 },
  dimensions: { x: 4, z: 4 }
});
```

### Colorful Spiral
```javascript
clearScene();

const colors = ['#ff0000', '#ff7700', '#ffff00', '#00ff00', '#0000ff', '#8800ff'];

for (let i = 0; i < 30; i++) {
  createBrick({
    color: colors[i % colors.length],
    position: {
      x: Math.cos(i * 0.5) * 50,
      y: i * BRICK_HEIGHT,
      z: Math.sin(i * 0.5) * 50
    },
    rotation: i * 0.3
  });
  await wait(100);
}

setIsometricView();
```

## Helpful Commands Quick Reference 📋

### Must-Know Commands
```javascript
clearScene();                  // Delete everything
createBrick({ ... });          // Make a brick
await wait(500);              // Pause for 500 milliseconds

// Camera views
setTopView();
setFrontView();
setSideView();
setIsometricView();

// Collision detection
isPositionOccupied(pos);      // Check if spot is taken
getNextFreePosition();        // Find next empty spot

// Brick info
getBrickCount();              // How many bricks total?
findBricksByColor('#ff0000'); // Find all red bricks
```

### Constants
```javascript
BRICK_HEIGHT   // = 24 (how tall a brick is)
BRICK_SPACING  // = 25 (good spacing between bricks)
STUD_SIZE      // = 10 (size of a stud)
```

## Tips for Success 💡

1. **Start Small:** Build simple things first, then make them bigger
2. **Use await wait():** Makes animations smooth and fun to watch
3. **Check for overlaps:** Always use `isPositionOccupied()` or `getNextFreePosition()`
4. **Experiment:** Try changing numbers to see what happens!
5. **Use loops:** Don't copy code - use `for` loops instead
6. **Comment your code:** Add notes like `// This makes the roof`
7. **Save your work:** Use the Export button to save your creations!

## Getting Help 🆘

- **Something not working?** Check the Console for error messages
- **Bricks overlapping?** Use `isPositionOccupied()` to check first
- **Can't see your bricks?** Try different camera views
- **Code not running?** Make sure you clicked the "Run" button!

## Share Your Creations! 🌟

Build something awesome? Show your friends and family! You can:
- Take screenshots of your 3D creations
- Export your code to share with others
- Try to recreate buildings from real life
- Invent new patterns and designs

## Have Fun! 🎉

Remember: there's no "wrong" way to build in CodeBlocks. The best way to learn is to **experiment and have fun!** Try new things, make mistakes, and keep building!

**Happy coding, young builder!** 🚀🧱✨
