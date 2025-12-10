# CodeBlocks Deployment Guide

This guide covers deploying CodeBlocks in various environments. For basic local development setup, see the [Quick Start](README.md#quick-start) section in the README.

## Table of Contents

- [Local Development](#local-development)
- [Production Build](#production-build)
- [Docker Deployment](#docker-deployment)
- [Environment Variables](#environment-variables)
- [Backend Configuration](#backend-configuration)
- [Troubleshooting](#troubleshooting)
- [Production Considerations](#production-considerations)

## Local Development

### Prerequisites
- Node.js 17 or higher
- npm or yarn

### Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Access the application at **http://localhost:5000**

The development server includes hot reload for rapid development. See [README.md](README.md) for more details.

### Development with OpenSSL Legacy Provider

If you encounter OpenSSL-related errors on newer Node versions:

```bash
NODE_OPTIONS=--openssl-legacy-provider npm start
```

## Production Build

### Building Static Files

Build optimized static files for production deployment:

```bash
npm run build
```

Built files will be output to the `docs/` directory and can be served by any static file server.

### Serving Built Files

**Using npx:**
```bash
npx serve docs
```

**Using Python:**
```bash
cd docs
python3 -m http.server 8000
```

**Using Nginx:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/codeblocks/docs;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Docker Deployment

### Prerequisites
- Docker
- Docker Compose

### Quick Start

1. **Create environment file (optional, for AI features):**
   ```bash
   cp .env.example .env
   # Edit .env and add your OpenAI API key
   ```

2. **Build and start containers:**
   ```bash
   docker compose up -d
   ```

3. **Access the application:**
   - Local: http://localhost:9000
   - Network: http://0.0.0.0:9000

### Managing Docker Containers

**Stop containers:**
```bash
docker compose down
```

**View logs:**
```bash
docker compose logs -f frontend
```

**Rebuild after code changes:**
```bash
docker compose build
docker compose up -d
```

**Restart containers:**
```bash
docker compose restart frontend
```

### Port Configuration

The default port is 9000. To change it, edit `docker-compose.yml`:

```yaml
services:
  frontend:
    ports:
      - "YOUR_PORT:9000"  # Change YOUR_PORT to desired port
```

Or set the PORT environment variable:

```yaml
environment:
  - PORT=8080
```

### Docker Architecture

**Multi-stage build process:**

1. **Build Stage** (Node 17 Alpine)
   - Installs dependencies
   - Builds the production bundle
   - Optimizes assets

2. **Runtime Stage** (Nginx Alpine)
   - Serves static files
   - Lightweight production image
   - ~50MB final image size

## Environment Variables

### Optional Variables

CodeBlocks works without any environment variables, but the following enable additional features:

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `OPENAI_API_KEY` | OpenAI API key for AI assistant | No | None |
| `OPENAI_MODEL` | OpenAI model to use | No | `gpt-4` |
| `PORT` | Server port (Docker only) | No | `9000` |

### Configuration

**For Docker deployment**, create a `.env` file in the project root:

```bash
# .env
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL=gpt-4
PORT=9000
```

**For local development**, environment variables are not typically needed unless you're using the AI assistant features.

### Security Note

**Never commit `.env` files to version control.** The `.env` file is included in `.gitignore` by default.

## Backend Configuration

### OpenAI Integration (Optional)

CodeBlocks includes optional AI-assisted scripting powered by OpenAI. This feature:

- Provides intelligent code suggestions
- Helps debug scripts
- Generates example code based on descriptions
- Answers API questions

**To enable:**

1. Get an API key from [OpenAI Platform](https://platform.openai.com/)
2. Add to `.env` file (see [Environment Variables](#environment-variables))
3. Restart the application

**Note:** The AI assistant is **optional**. All core CodeBlocks features work without it.

### Backend API Endpoints

If running with the backend server, the following endpoints are available:

- `POST /api/chat` - AI assistant chat endpoint
- `GET /health` - Health check endpoint

## Troubleshooting

### Common Issues

#### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:** Change the port in `webpack.dev.config.js` or kill the process using the port:

```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

#### OpenSSL Provider Error

**Error:** `digital envelope routines::unsupported`

**Solution:** Use legacy OpenSSL provider:

```bash
NODE_OPTIONS=--openssl-legacy-provider npm start
```

#### Docker Build Fails

**Error:** Build fails during npm install

**Solutions:**
1. Clear Docker cache: `docker system prune -a`
2. Rebuild without cache: `docker compose build --no-cache`
3. Check Docker has enough memory (increase to 4GB+ in Docker settings)

#### Cannot Access Application

**Error:** Application doesn't load in browser

**Checks:**
1. Verify containers are running: `docker compose ps`
2. Check logs: `docker compose logs -f frontend`
3. Verify port mapping in `docker-compose.yml`
4. Check firewall settings
5. Try accessing via `http://0.0.0.0:9000` instead of localhost

#### Hot Reload Not Working

**Error:** Changes don't appear in browser

**Solutions:**
1. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear browser cache
3. Check webpack dev server is watching files
4. Verify file paths in `webpack.dev.config.js`

## Production Considerations

### Performance

**Optimization tips:**
- Use the production build (`npm run build`) - it's minified and optimized
- Enable gzip compression in your web server
- Serve static assets with appropriate cache headers
- Use a CDN for global distribution

**Nginx gzip configuration:**
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
gzip_min_length 1000;
```

### Security

**Best practices:**
1. **HTTPS:** Always use HTTPS in production (use Let's Encrypt for free certificates)
2. **API Keys:** Keep OPENAI_API_KEY secure, never expose in client-side code
3. **CORS:** Configure appropriate CORS headers if hosting API separately
4. **CSP:** Consider adding Content Security Policy headers
5. **Rate Limiting:** Implement rate limiting on API endpoints

**Example Nginx HTTPS configuration:**
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    root /path/to/codeblocks/docs;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Monitoring

**Recommended monitoring:**
- Application uptime (e.g., UptimeRobot, Pingdom)
- Server resource usage (CPU, memory, disk)
- Error logs
- API usage (if using OpenAI integration)

### Scaling

**For high traffic:**
1. Use a CDN (Cloudflare, AWS CloudFront)
2. Enable browser caching
3. Consider horizontal scaling with load balancer
4. Monitor and optimize bundle size

### Backups

**What to backup:**
- User-created models (if implementing server-side storage)
- Configuration files
- Environment variables (securely)

### Updates

**Updating CodeBlocks:**

1. Pull latest changes: `git pull origin master`
2. Install dependencies: `npm install`
3. Rebuild: `npm run build`
4. Restart Docker: `docker compose up -d --build`

## Support

For deployment issues:
- Check [Troubleshooting](#troubleshooting) section above
- Review [GitHub Issues](https://github.com/[username]/codeblocks/issues)
- See [CONTRIBUTING.md](CONTRIBUTING.md) for reporting bugs
- Check [README.md](README.md) for general documentation

## Architecture Diagram

```
┌─────────────────────────────────────────┐
│           CodeBlocks Frontend           │
│                                         │
│  ┌────────────┐      ┌──────────────┐  │
│  │   React    │──────│   Three.js   │  │
│  │    App     │      │  Rendering   │  │
│  └────────────┘      └──────────────┘  │
│        │                                │
│        │  API Calls (optional)          │
│        ▼                                │
│  ┌────────────────────────────────┐    │
│  │  Backend (Express + OpenAI)    │    │
│  │  - AI assistant                │    │
│  │  - Code suggestions            │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

## Next Steps

- Review [README.md](README.md) for feature overview
- Check [docs/scripting-api.md](docs/scripting-api.md) for API documentation
- See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines
