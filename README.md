# CodeBlocks

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**CodeBlocks** is an interactive 3D brick builder with a powerful JavaScript scripting API. Create LEGO-style models visually or programmatically, with support for animations, collision detection, and complex spatial operations.

![CodeBlocks Interface](/examples/screenshot.png)

## Features

- **Visual 3D Builder** - Intuitive click-and-build interface with real-time rendering
- **JavaScript Scripting API** - Complete v2.0 API for programmatic brick creation and animation
- **Automatic Collision Detection** - Built-in spatial awareness prevents overlapping bricks
- **Command-Based Animations** - Reliable animation system with chainable commands
- **Import/Export Models** - Save and share creations as JSON files
- **Multiple Brick Types** - Rectangles, slopes, cylinders, corners, curves, and more
- **Example Library** - 29 organized examples from beginner to advanced
- **Educational Focus** - Designed for learners ages 5+ to professional developers
- **AI Assistant Integration** - Optional OpenAI integration for guided scripting

## Quick Start

### Installation

```bash
npm install
```

### Development

Start the development server with hot reload:

```bash
npm start
```

The app will be available at **http://localhost:5000**

### Production Build

Build optimized static files for deployment:

```bash
npm run build
```

Serve the built files with any static file server. Example:

```bash
npx serve docs
```

### Docker Deployment

For containerized deployment:

```bash
docker compose up -d
```

The app will be available at **http://localhost:9000**

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## Documentation

- **[Scripting API Reference](docs/scripting-api.md)** - Complete v2.0 API documentation with examples
- **[JSON Structure](docs/json-structure.md)** - Model import/export format specification
- **[Deployment Guide](DEPLOYMENT.md)** - Production deployment instructions

## Examples

The project includes 29 example scripts organized by skill level:

### Beginner Examples (10)
`app/utils/examples-beginner.js`
- Single bricks, colors, basic shapes
- Simple structures (walls, pyramids)
- Introduction to animations and rotations

### Intermediate Examples (10)
`app/utils/examples-intermediate.js`
- Multi-brick structures
- Collision detection usage
- Complex animations and patterns
- Spatial queries and positioning

### Advanced Examples (9)
`app/utils/examples-advanced.js`
- Procedural generation algorithms
- Recursive patterns and fractals
- Performance optimization techniques
- Complex animation sequences

Load examples from the built-in dropdown menu in the Script Editor.

## API Quick Reference

```javascript
// Create bricks
const brickId = createBrick({
  color: 'red',
  position: { x: 0, y: 24, z: 0 },
  dimensions: { x: 2, z: 4 }
});

// Animate bricks
animate(brickId)
  .move({ x: 0, y: 100, z: 0 })
  .rotate(Math.PI / 2)
  .changeColor('blue')
  .run();

// Collision detection
const hasCollision = testPosition({ x: 0, y: 24, z: 0 });
const freePos = findFreePosition({ x: 0, y: 24, z: 0 });

// Spatial queries
const bounds = getBounds(brickId);
const nearby = getBricksInRegion({ min: { x: -50, y: 0, z: -50 }, max: { x: 50, y: 100, z: 50 } });
```

See [docs/scripting-api.md](docs/scripting-api.md) for the complete API reference.

## Project Structure

```
codeblocks/
├── app/
│   ├── components/      # React components
│   ├── utils/           # Utility functions and example scripts
│   ├── styles/          # LESS stylesheets
│   └── index.jsx        # Application entry point
├── backend/
│   └── src/             # Backend server (OpenAI integration)
├── docs/                # Documentation
│   ├── scripting-api.md
│   └── json-structure.md
├── examples/            # Example models (JSON)
├── CHANGELOG.md         # Version history
├── CONTRIBUTING.md      # Contribution guidelines
├── DEPLOYMENT.md        # Deployment guide
└── LICENSE              # MIT License
```

## Version 2.0 Highlights

CodeBlocks v2.0 introduces significant improvements to the scripting API:

- **Breaking Change:** `createBrick()` now returns brick ID (string) instead of object
- **New Animation System:** Command-based pattern with `.run()` execution
- **Collision Detection:** Enabled by default for safety
- **Spatial Functions:** `testPosition()`, `findFreePosition()`, `getBounds()`, and more
- **Improved Reliability:** Fixed animation race conditions and memory leaks

See [CHANGELOG.md](CHANGELOG.md) for complete version history and migration guide.

## Requirements

- **Node.js** 17 or higher
- **npm** or **yarn**
- **Modern browser** (Chrome, Firefox, Safari, or Edge)
- **Docker** (optional, for containerized deployment)

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for:

- Bug reporting guidelines
- Feature request process
- Pull request workflow
- Development setup
- Code style guidelines
- Testing requirements

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Documentation:** [docs/scripting-api.md](docs/scripting-api.md)
- **Examples:** [app/utils/](app/utils/) organized by skill level
- **Issues:** Report bugs and request features via GitHub Issues
- **Changelog:** [CHANGELOG.md](CHANGELOG.md)

## Acknowledgments

CodeBlocks is built with:

- **React** - UI framework
- **Three.js** - 3D rendering engine
- **Webpack** - Build system
- **OpenAI API** - AI-assisted scripting (optional)

---

**CodeBlocks** - Learn programming through creative 3D building
