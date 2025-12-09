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
    const systemContext = `You are an AI assistant helping with CodeBlocks scripting. CodeBlocks is a LEGO-style 3D builder.

Available API functions:
- createBrick({ position: {x, y, z}, color: {r, g, b, a}, dimensions: {x, z, y, type} }): Create a brick
- moveBrick(brickId, x, y, z): Move a brick to new position
- deleteBrick(brickId): Delete a brick
- setBrickColor(brickId, color): Change brick color
- clearScene(): Remove all bricks
- getBricks(): Get all bricks in scene
- wait(ms): Pause execution for milliseconds

Camera functions:
- setTopView(), setFrontView(), setSideView(), setIsometricView(), resetView()
- zoomIn(), zoomOut()
- setCameraPosition(x, y, z), setCameraTarget(x, y, z)

Available brick types: rectangle, slope45, slope33, slopeInverted, cornerInside, cornerOutside, cornerRound, curve, cylinder, cone, wedge, plate, tile

${currentScript ? `\n\nCurrent script:\n\`\`\`javascript\n${currentScript}\n\`\`\`` : ''}

Provide clear, concise JavaScript code examples. Use async/await for animations with createBrick().`;

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
