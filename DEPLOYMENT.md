# CodeBlocks Deployment Guide

## Running with Docker Compose

### Prerequisites
- Docker
- Docker Compose

### Quick Start

1. Build and start the containers:
   ```bash
   docker compose up -d
   ```

2. Access the application:
   - Local: http://localhost:9000
   - Network: http://0.0.0.0:9000

### Managing the Application

Stop the containers:
```bash
docker compose down
```

View logs:
```bash
docker compose logs -f frontend
```

Rebuild after code changes:
```bash
docker compose build
docker compose up -d
```

### Port Configuration

The frontend runs on port 9000 by default. To change it, edit `docker-compose.yml`:
```yaml
ports:
  - "YOUR_PORT:80"
```

### Architecture

- **Frontend**: React application built with Webpack, served by Nginx
- **Build Process**: Multi-stage Docker build
  - Stage 1: Node 17 Alpine - builds the application
  - Stage 2: Nginx Alpine - serves static files

### Development

For development with hot reload, use:
```bash
NODE_OPTIONS=--openssl-legacy-provider npm start
```

The dev server will run on port 5000 (configured in `webpack.dev.config.js`).
