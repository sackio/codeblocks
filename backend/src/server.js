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

    // Add system context about the scripting API
    const systemMessage = {
      role: 'system',
      content: `You are an AI assistant helping with CodeBlocks scripting. CodeBlocks is a LEGO-style 3D builder.

Available API functions:
- createBrick(x, y, z, color, dimensions, type): Create a brick at position with color {r, g, b, a}
- moveBrick(brickId, x, y, z): Move a brick to new position
- deleteBrick(brickId): Delete a brick
- setBrickColor(brickId, color): Change brick color
- clearScene(): Remove all bricks
- getBricks(): Get all bricks in scene
- brick(width, length, type): Helper to create dimension object
- getBrickId(x, y, z): Get brick ID at position
- wait(ms): Pause execution for milliseconds

Camera functions:
- setTopView(), setFrontView(), setSideView(), setIsometricView(), resetView()
- zoomIn(), zoomOut()
- setCameraPosition(x, y, z), setCameraTarget(x, y, z)
- getCameraPosition(), getCameraTarget()

Helper:
- createGrid(rows, cols, spacing, color): Create a grid of bricks

Available brick types: rectangle, slope45, slope33, slopeInverted, cornerInside, cornerOutside, cornerRound, curve, cylinder, cone, wedge, plate, tile

${currentScript ? `\n\nCurrent script:\n\`\`\`javascript\n${currentScript}\n\`\`\`` : ''}

Provide clear, concise JavaScript code examples. Use async/await for animations.`
    };

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      max_tokens: 2000,
    });

    res.json({
      message: response.choices[0].message,
      usage: response.usage,
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

    // Add system context about the JSON structure
    const systemMessage = {
      role: 'system',
      content: `You are an AI assistant helping with CodeBlocks JSON editing. CodeBlocks uses a JSON format to represent 3D brick scenes.

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

Position: x (horizontal), y (height), z (depth), in units of 25 (base size)
Color: r, g, b (0-255), a (0-1 for opacity)
Dimensions: x (width), z (length) in studs
Rotation: in radians (0, π/2, π, 3π/2)

${currentJSON ? `\n\nCurrent JSON:\n\`\`\`json\n${currentJSON}\n\`\`\`` : ''}

Help with JSON validation, structure, and brick configurations. Provide valid JSON examples.`
    };

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      max_tokens: 2000,
    });

    res.json({
      message: response.choices[0].message,
      usage: response.usage,
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

    const messagesToSend = systemPrompt
      ? [{ role: 'system', content: systemPrompt }, ...messages]
      : messages;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: messagesToSend,
      temperature: 0.7,
      max_tokens: 2000,
    });

    res.json({
      message: response.choices[0].message,
      usage: response.usage,
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
