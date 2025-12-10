const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config({ path: '../.env' });
const OpenAI = require('openai');

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'CodeBlocks backend is running' });
});

// Chat completion endpoint for script editor
app.post('/api/chat/script', async (req, res) => {
  try {
    const { messages, currentScript } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const model = process.env.OPENAI_MODEL || 'o1';
    const isReasoningModel = model.startsWith('o1') || model.startsWith('o3');

    // System context about the scripting API
    const systemContext = `You are an AI assistant helping with CodeBlocks scripting. CodeBlocks is a LEGO-style 3D builder with automatic collision detection.

=== IMPORTANT: CodeBlocks v2.0 API (Collision-Aware) ===

CORE PRINCIPLES:
1. Safe by default: createBrick() prevents overlapping bricks automatically
2. Explicit overrides available when needed
3. createBrick() returns brick ID (string), NOT an object
4. Use animate() for animations (command pattern, not promise chaining)

CORE BRICK FUNCTIONS:
- createBrick(options): Create a brick with collision detection
  * Returns: brick ID (string) on success, null if collision detected
  * Parameters:
    - position: {x, y, z} (required if y is set, otherwise auto-places at y=24)
    - color: hex string '#ff6b35' or CSS color name 'red' (default: '#ff6b35')
    - dimensions: {x, z} in studs (default: {x: 2, z: 2})
    - type: brick shape (default: 'rectangle')
    - rotation: 0 to 2π radians (default: 0)
    - checkCollision: true/false (default: true) - check for overlaps
    - force: true/false (default: false) - override collision detection
  * Example: const id = createBrick({ color: 'red', position: {x: 0, y: 24, z: 0} });

- animate(brickId): Create animation for a brick (returns animator with chainable commands)
  * Commands: .color(newColor), .move(position), .moveBy(delta), .rotate(angle), .wait(ms), .delete()
  * Must call .run() at end to execute
  * Example: await animate(id).color('blue').wait(500).move({x: 50, y: 24, z: 0}).run();

- brick(brickId): Get brick info
  * Returns: {id, position, color, dimensions, rotation} or null

- moveBrick(brickId, position): Move brick (no collision check)
- deleteBrick(brickId): Delete a brick
- setBrickColor(brickId, color): Change color
- clearScene(): Remove all bricks
- getBricks(): Get all brick objects
- wait(ms): Pause execution

COLLISION DETECTION FUNCTIONS:
- getCollisions(position, dimensions): Find bricks at position
  * Returns: array of colliding bricks
- testPosition(position, dimensions): Check if position is free
  * Returns: true if free, false if occupied
- findFreePosition(start, dimensions, options): Find nearest free position
  * Returns: {x, y, z} position or null
  * Options: {spacing: 25, maxRadius: 20, excludeIds: []}
- getBounds(brickId): Get AABB bounding box
  * Returns: {min: {x, y, z}, max: {x, y, z}}
- getCenter(brickId): Get center position
  * Returns: {x, y, z}
- getVolume(brickId): Calculate volume
  * Returns: number (cubic units)
- getBricksInRegion(bounds): Query bricks in region
  * bounds: {min: {x, y, z}, max: {x, y, z}}
  * Returns: array of bricks

CAMERA FUNCTIONS:
- setTopView(), setFrontView(), setSideView(), setIsometricView(), resetView()
- zoomIn(), zoomOut()
- setCameraPosition(x, y, z), setCameraTarget(x, y, z)

BRICK TYPES: rectangle, slope45, slope33, slopeInverted, cornerInside, cornerOutside, cornerRound, curve, cylinder, cone, wedge, plate, tile

COORDINATE SYSTEM:
- X: horizontal (left/right)
- Y: vertical (height) - typical ground level is y=24
- Z: depth (forward/back)
- Measurements: base unit = 25, default brick height = 33

BEST PRACTICES:
1. Always use await with animate().run()
2. Let collision detection work (don't force unless needed)
3. Use findFreePosition() for automatic placement
4. Stack bricks with y = previousY + 33 (standard brick height)
5. Use testPosition() before moving to check safety
6. Chain animations: animate(id).color('red').wait(500).move({x: 50, y: 24, z: 0}).run()

COMMON PATTERNS:

Beginner (collision-free by default):
\`\`\`javascript
// Simple stack - automatically prevents overlaps
for (let i = 0; i < 5; i++) {
  createBrick({
    color: 'red',
    position: { x: 0, y: i * 33 + 24, z: 0 }
  });
  await wait(200);
}
\`\`\`

Intermediate (using collision API):
\`\`\`javascript
// Smart stacking with collision detection
let y = 24;
for (let i = 0; i < 10; i++) {
  const pos = { x: 0, y, z: 0 };
  if (testPosition(pos, { x: 2, z: 2 })) {
    createBrick({ position: pos, color: 'blue' });
    y += 33;
  } else {
    console.log('Position occupied, finding free spot...');
    const freePos = findFreePosition(pos, { x: 2, z: 2 });
    if (freePos) createBrick({ position: freePos, color: 'green' });
  }
}
\`\`\`

Advanced (parallel animations):
\`\`\`javascript
// Multiple bricks moving simultaneously
const ids = [];
for (let i = 0; i < 5; i++) {
  const id = createBrick({
    position: { x: i * 50, y: 24, z: 0 },
    color: \`hsl(\${i * 60}, 80%, 50%)\`
  });
  ids.push(id);
}

// Animate all in parallel
await Promise.all(ids.map(id =>
  animate(id).moveBy({ y: 100 }).wait(300).moveBy({ y: -100 }).run()
));
\`\`\`

${currentScript ? `\n\nCurrent script:\n\`\`\`javascript\n${currentScript}\n\`\`\`` : ''}

REMEMBER:
- createBrick() returns ID string (or null if collision)
- Use animate() for animations, not BrickAPI objects
- Collision detection is ON by default (safe-by-default)
- Always await animate().run()

Provide clear, concise JavaScript code using the v2.0 API patterns above.`;

    let messagesToSend;
    if (isReasoningModel) {
      // o1/o3 models: no system messages, prepend context to first user message
      messagesToSend = [...messages];
      if (messagesToSend.length > 0 && messagesToSend[0].role === 'user') {
        messagesToSend[0] = {
          role: 'user',
          content: `${systemContext}\n\n${messagesToSend[0].content}`
        };
      }
    } else {
      // Regular models: use system message
      messagesToSend = [{ role: 'system', content: systemContext }, ...messages];
    }

    const apiParams = {
      model,
      messages: messagesToSend,
    };

    if (isReasoningModel) {
      // o1/o3 models: use max_completion_tokens, no temperature
      apiParams.max_completion_tokens = 4000;
    } else {
      // Regular models: use temperature and max_tokens
      apiParams.temperature = 0.7;
      apiParams.max_tokens = 2000;
    }

    const response = await openai.chat.completions.create(apiParams);

    res.json({
      message: response.choices[0].message,
      usage: response.usage,
      reasoning_tokens: response.usage?.completion_tokens_details?.reasoning_tokens || 0,
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({
      error: 'Failed to get AI response',
      details: error.message
    });
  }
});

// Chat completion endpoint for JSON editor
app.post('/api/chat/json', async (req, res) => {
  try {
    const { messages, currentJSON } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const model = process.env.OPENAI_MODEL || 'o1';
    const isReasoningModel = model.startsWith('o1') || model.startsWith('o3');

    // System context about the JSON structure
    const systemContext = `You are an AI assistant helping with CodeBlocks JSON editing. CodeBlocks uses a JSON format to represent 3D brick scenes.

JSON Structure:
{
  "bricks": [
    {
      "id": "unique-uuid",
      "position": { "x": 0, "y": 25, "z": 0 },
      "color": { "r": 255, "g": 0, "b": 0, "a": 1 },
      "dimensions": { "x": 2, "z": 4, "type": "rectangle" },
      "rotation": 0
    }
  ]
}

Brick types: rectangle, slope45, slope33, slopeInverted, cornerInside, cornerOutside, cornerRound, curve, cylinder, cone, wedge, plate, tile

Position: x (horizontal), y (height), z (depth) - exact coordinates
Color: r, g, b (0-255), a (0-1 for opacity)
Dimensions: x (width), z (length) in studs, y (height multiplier)
Rotation: in radians (0, π/2, π, 3π/2)

${currentJSON ? `\n\nCurrent JSON:\n\`\`\`json\n${currentJSON}\n\`\`\`` : ''}

Help with JSON validation, structure, and brick configurations. Provide valid JSON examples.`;

    let messagesToSend;
    if (isReasoningModel) {
      // o1/o3 models: no system messages, prepend context to first user message
      messagesToSend = [...messages];
      if (messagesToSend.length > 0 && messagesToSend[0].role === 'user') {
        messagesToSend[0] = {
          role: 'user',
          content: `${systemContext}\n\n${messagesToSend[0].content}`
        };
      }
    } else {
      // Regular models: use system message
      messagesToSend = [{ role: 'system', content: systemContext }, ...messages];
    }

    const apiParams = {
      model,
      messages: messagesToSend,
    };

    if (isReasoningModel) {
      // o1/o3 models: use max_completion_tokens, no temperature
      apiParams.max_completion_tokens = 4000;
    } else {
      // Regular models: use temperature and max_tokens
      apiParams.temperature = 0.7;
      apiParams.max_tokens = 2000;
    }

    const response = await openai.chat.completions.create(apiParams);

    res.json({
      message: response.choices[0].message,
      usage: response.usage,
      reasoning_tokens: response.usage?.completion_tokens_details?.reasoning_tokens || 0,
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({
      error: 'Failed to get AI response',
      details: error.message
    });
  }
});

// General chat endpoint (for other purposes)
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, systemPrompt } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const model = process.env.OPENAI_MODEL || 'o1';
    const isReasoningModel = model.startsWith('o1') || model.startsWith('o3');

    let messagesToSend;
    if (isReasoningModel && systemPrompt) {
      // o1/o3 models: prepend system prompt to first user message
      messagesToSend = [...messages];
      if (messagesToSend.length > 0 && messagesToSend[0].role === 'user') {
        messagesToSend[0] = {
          role: 'user',
          content: `${systemPrompt}\n\n${messagesToSend[0].content}`
        };
      }
    } else if (systemPrompt) {
      // Regular models: use system message
      messagesToSend = [{ role: 'system', content: systemPrompt }, ...messages];
    } else {
      messagesToSend = messages;
    }

    const apiParams = {
      model,
      messages: messagesToSend,
    };

    if (isReasoningModel) {
      // o1/o3 models: use max_completion_tokens, no temperature
      apiParams.max_completion_tokens = 4000;
    } else {
      // Regular models: use temperature and max_tokens
      apiParams.temperature = 0.7;
      apiParams.max_tokens = 2000;
    }

    const response = await openai.chat.completions.create(apiParams);

    res.json({
      message: response.choices[0].message,
      usage: response.usage,
      reasoning_tokens: response.usage?.completion_tokens_details?.reasoning_tokens || 0,
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({
      error: 'Failed to get AI response',
      details: error.message
    });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`CodeBlocks backend running on port ${PORT}`);
  console.log(`OpenAI model: ${process.env.OPENAI_MODEL || 'gpt-4o'}`);
});
