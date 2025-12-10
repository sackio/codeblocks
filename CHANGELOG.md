# Changelog

All notable changes to CodeBlocks will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2024-12-10

### Added
- New collision detection system (enabled by default)
- Command-based animation system with `animate()` API
- Collision API functions: `getCollisions()`, `testPosition()`, `findFreePosition()`
- Spatial query functions: `getBounds()`, `getCenter()`, `getVolume()`, `getBricksInRegion()`
- Comprehensive example library (beginner, intermediate, advanced)
- Docker Compose deployment support
- Full API documentation in docs/scripting-api.md
- OpenAI integration for AI-assisted scripting

### Changed
- **BREAKING**: `createBrick()` now returns brick ID (string), not object
- **BREAKING**: All animations now use `animate(brickId)` pattern with `.run()`
- **BREAKING**: Collision detection now enabled by default
- Brick IDs are now strings instead of objects with methods
- Animation system rewritten for reliability and predictability
- Project renamed from "Brick Builder" to "CodeBlocks"

### Removed
- **BREAKING**: BrickAPI wrapper class removed
- Old OOP-style brick methods (`.color()`, `.move()`, `.getPosition()`)

### Fixed
- Animation reliability issues
- Memory leaks in animation system
- Collision detection edge cases
- Race conditions in async animations

## [1.0.0] - 2024-11-30

### Features
- Basic brick creation and deletion
- Color picker and paint mode
- Import/export JSON models
- Multiple brick shapes (rectangle, slope, cylinder, etc.)
- Grid toggle
- Camera controls (pan, zoom, rotate)
- Webpack-based development environment

---

For migration guide from v1.x to v2.0, see [docs/scripting-api.md#migration-from-v1x](docs/scripting-api.md#migration-from-v1x)
