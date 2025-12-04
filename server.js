const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
require('dotenv').config();
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Load API documentation for LLM context
const scriptingApiDocs = fs.readFileSync(path.join(__dirname, 'docs/scripting-api.md'), 'utf-8');
const jsonStructureDocs = fs.readFileSync(path.join(__dirname, 'docs/json-structure.md'), 'utf-8');

// Webpack configuration
const webpackConfig = require('./webpack.dev.config.js');
const compiler = webpack(webpackConfig);

// Middleware
// Increase limit to 50mb to handle base64-encoded canvas screenshots
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Webpack dev middleware
app.use(webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    assets: true,
    colors: true,
    version: false,
    hash: false,
    timings: false,
    chunks: false,
    chunkModules: false,
  },
}));

// Webpack hot middleware (currently disabled in config, but ready for future use)
// app.use(webpackHotMiddleware(compiler));

// Serve static assets
app.use(express.static(path.join(__dirname, 'assets')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'CodeBlocks server is running' });
});

// Chat completion endpoint for script editor
app.post('/api/chat/script', async (req, res) => {
  try {
    const { messages, currentScript, mode = 'chat', screenshot } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Build system message based on mode
    let systemContent = `You are an AI assistant helping with CodeBlocks scripting. CodeBlocks is a LEGO-style 3D builder.

${scriptingApiDocs}

${currentScript ? `\n\nCurrent script:\n\`\`\`javascript\n${currentScript}\n\`\`\`` : ''}

CRITICAL REQUIREMENTS FOR ALL SCRIPTS:
1. ALWAYS prevent overlapping bricks by using collision detection functions
2. Use getNextFreePosition() for automatic non-overlapping placement when creating multiple bricks
3. Use isPositionOccupied() to check before placing bricks at specific positions
4. Use snapToGrid() to ensure proper alignment
5. Never place two bricks at the same position - this creates visual glitches
6. Start scripts with clearScene() to ensure a clean slate
7. Include helpful comments to teach kids how the code works - explain loops, calculations, and logic

`;

    if (mode === 'generate') {
      systemContent += `\nThe user wants you to GENERATE a new script based on their description. Return ONLY executable JavaScript code without markdown code fences or explanations. The code should be ready to run directly.

IMPORTANT:
- Use getNextFreePosition() or isPositionOccupied() to prevent overlapping bricks!
- Add clear, educational comments to help kids learn - explain what each section does and why`;
    } else if (mode === 'edit') {
      systemContent += `\nThe user wants you to EDIT the existing script based on their instructions. Return ONLY the complete modified JavaScript code without markdown code fences or explanations. The code should be ready to run directly.

IMPORTANT:
- Ensure the edited script prevents overlapping bricks using collision detection functions!
- Add or improve comments to help kids understand the code - explain complex logic and calculations`;
      if (screenshot) {
        systemContent += `\n\nA screenshot of the current 3D canvas has been provided for visual context.`;
      }
    }

    const systemMessage = {
      role: 'system',
      content: systemContent
    };

    // If screenshot is provided, format user message with vision API
    const userMessages = screenshot ? messages.map(msg => {
      if (msg.role === 'user') {
        return {
          role: 'user',
          content: [
            { type: 'text', text: msg.content },
            { type: 'image_url', image_url: { url: screenshot } }
          ]
        };
      }
      return msg;
    }) : messages;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [systemMessage, ...userMessages],
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
    const { messages, currentJSON, mode = 'chat', screenshot } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Build system message based on mode
    let systemContent = `You are an AI assistant helping with CodeBlocks JSON editing. CodeBlocks uses a JSON format to represent 3D brick scenes.

${jsonStructureDocs}

${currentJSON ? `\n\nCurrent JSON:\n\`\`\`json\n${currentJSON}\n\`\`\`` : ''}

CRITICAL REQUIREMENTS FOR ALL JSON:
1. ALWAYS prevent overlapping bricks - no two bricks should have the same position
2. Use proper spacing between bricks (25-50 units for X and Z coordinates)
3. Use multiples of 24 for Y coordinates (brick height)
4. Ensure all positions are unique to avoid visual glitches
5. Use grid-aligned positions for clean layouts

`;

    if (mode === 'generate') {
      systemContent += `\nThe user wants you to GENERATE a new JSON structure based on their description. Return ONLY valid JSON without markdown code fences or explanations. The JSON should be properly formatted and ready to parse.

IMPORTANT: Ensure all brick positions are unique to prevent overlapping!`;
    } else if (mode === 'edit') {
      systemContent += `\nThe user wants you to EDIT the existing JSON based on their instructions. Return ONLY the complete modified JSON without markdown code fences or explanations. The JSON should be properly formatted and ready to parse.

IMPORTANT: Ensure the edited JSON has no overlapping bricks - all positions must be unique!`;
      if (screenshot) {
        systemContent += `\n\nA screenshot of the current 3D canvas has been provided for visual context.`;
      }
    }

    const systemMessage = {
      role: 'system',
      content: systemContent
    };

    // If screenshot is provided, format user message with vision API
    const userMessages = screenshot ? messages.map(msg => {
      if (msg.role === 'user') {
        return {
          role: 'user',
          content: [
            { type: 'text', text: msg.content },
            { type: 'image_url', image_url: { url: screenshot } }
          ]
        };
      }
      return msg;
    }) : messages;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [systemMessage, ...userMessages],
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

// Fallback for SPA routing - must be last
app.use((req, res, next) => {
  // Let webpack dev middleware handle its requests
  if (req.url.includes('.') || req.url.startsWith('/api/')) {
    return next();
  }
  // For all other routes, serve the index.html for client-side routing
  const filename = path.join(compiler.outputPath, 'index.html');
  compiler.outputFileSystem.readFile(filename, (err, result) => {
    if (err) {
      return next(err);
    }
    res.set('content-type', 'text/html');
    res.send(result);
    res.end();
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`CodeBlocks server running on port ${PORT}`);
  console.log(`OpenAI model: ${process.env.OPENAI_MODEL || 'gpt-4o'}`);
  console.log(`Visit http://localhost:${PORT}`);
});
