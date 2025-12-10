# Contributing to CodeBlocks

Thank you for considering contributing to CodeBlocks! This document provides guidelines for contributing to the project.

## Code of Conduct

Please be respectful and constructive in all interactions. We're building this project for learners of all ages and skill levels, so maintain a welcoming and inclusive environment.

## How to Contribute

### Reporting Bugs

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS information
- Screenshots or screen recordings if applicable
- Console errors (check browser DevTools)

### Suggesting Features

Feature requests are welcome! Please:
- Check existing issues to avoid duplicates
- Explain the use case clearly
- Provide examples or mockups if possible
- Consider how it fits with the project's educational goals

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Follow existing code style
   - Add tests if applicable
   - Update documentation
   - Test thoroughly in multiple browsers
4. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
5. **Push to branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**
   - Describe your changes clearly
   - Reference any related issues
   - Include screenshots/GIFs for UI changes

## Development Setup

### Prerequisites
- Node.js 17+
- npm or yarn
- Docker (optional, for containerized deployment)
- Modern browser (Chrome, Firefox, Safari, or Edge)

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/[username]/codeblocks.git
   cd codeblocks
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm start
   ```

   The app will be available at http://localhost:5000 with hot reload enabled.

4. Build for production:
   ```bash
   npm run build
   ```

### Docker Development

For containerized development:

```bash
docker compose up -d
docker compose logs -f frontend
```

Access the app at http://localhost:9000

## Code Style

- Use modern JavaScript (ES6+)
- Follow existing patterns in the codebase
- Write clear, descriptive variable names
- Add comments for complex logic
- Keep functions focused and small
- Use meaningful commit messages

## Project Structure

```
codeblocks/
├── app/
│   ├── components/      # React components
│   ├── utils/           # Utility functions and examples
│   ├── styles/          # LESS stylesheets
│   └── index.jsx        # Application entry point
├── backend/
│   └── src/             # Backend server (OpenAI integration)
├── docs/                # Documentation
├── examples/            # Example models (JSON)
├── test-scripts/        # API test scripts
└── webpack configs      # Build configuration
```

## Scripting API Changes

If modifying the scripting API (this is critical!):

1. **Update the API implementation**
   - Edit `app/components/ScriptEditor.jsx`
   - Maintain backwards compatibility when possible
   - Add version guards for breaking changes

2. **Update documentation**
   - Update `docs/scripting-api.md` with new functions/changes
   - Add code examples demonstrating usage
   - Update migration guide if breaking changes

3. **Add examples**
   - Add examples in `app/utils/examples-*.js`
   - Cover beginner, intermediate, and advanced use cases
   - Ensure examples run without errors

4. **Update AI assistant prompt**
   - Update system prompt in `backend/src/server.js`
   - Ensure AI can help users with new features

5. **Add tests**
   - Create test scripts in `test-scripts/`
   - Verify functionality works as expected

## Testing

Before submitting a PR:

1. **Manual testing**
   - Test your changes in the UI
   - Try different browsers (Chrome, Firefox, Safari)
   - Check mobile responsiveness if UI changes
   - Test with different screen sizes

2. **Example scripts**
   - Run example scripts to verify API compatibility
   - Ensure beginner examples still work
   - Check that your changes don't break existing scripts

3. **Console checks**
   - Check browser console for errors
   - Verify no warnings in production build
   - Check for memory leaks (use browser DevTools)

4. **Build verification**
   - Run `npm run build` successfully
   - Test the production build locally
   - Verify Docker build works if applicable

## Documentation

When adding features:

- Update relevant documentation files
- Add code examples to docs
- Update CHANGELOG.md
- Add to README.md if user-facing
- Include inline code comments
- Update API reference if applicable

## What to Work On

### Good First Issues
- Fix typos in documentation
- Add more example scripts
- Improve error messages
- Add unit tests
- Enhance UI accessibility

### Feature Ideas
- Additional brick shapes
- Undo/redo functionality
- Save/load projects
- Share links to creations
- Animation timeline editor
- Collaborative editing

## Questions?

- Open an issue for questions about the project
- Check existing documentation first
- Join discussions on GitHub

## Recognition

Contributors will be:
- Listed in project README
- Credited in release notes
- Appreciated and thanked!

Thank you for contributing to CodeBlocks! 🎉
