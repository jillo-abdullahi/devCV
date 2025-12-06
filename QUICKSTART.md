# Quick Start Guide

## Initial Setup

1. **Install dependencies for all workspaces:**

```bash
npm install
```

This will install dependencies for the root, client, and server workspaces.

## Development Workflow

### Running the Client

```bash
npm run dev:client
# or
cd client && npm run dev
```

The client will be available at `http://localhost:5173`

### Running the Server

```bash
npm run dev:server
# or
cd server && npm run dev
```

The server will be available at `http://localhost:8080`

### Running Both Client and Server

```bash
npm run dev:all
```

This runs both workspaces concurrently.

## Project Structure

```
devcv/                          # Monorepo root
├── client/                     # React frontend (Vite + React + TanStack Router)
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── lib/              # API client and utilities
│   │   ├── stores/           # Zustand state management
│   │   ├── routes/           # TanStack Router routes
│   │   └── types/            # TypeScript types
│   ├── package.json
│   └── vite.config.ts
├── server/                     # Backend API (Express + Playwright for PDF generation)
│   ├── pdfGenerator.ts        # PDF generation logic
│   ├── server.ts             # Express server
│   ├── mockData.ts           # Sample resume data
│   ├── package.json
│   ├── Dockerfile            # Docker configuration
│   └── DEPLOY.md             # Deployment instructions
├── shared/                     # Shared templates and types
│   ├── templates/            
│   │   ├── TemplateMinimalist.tsx  # Resume template component
│   │   └── index.ts
│   ├── types.ts              # ResumeData, TemplateConfig types
│   └── templateConfigs.ts    # Template font configurations
├── package.json               # Root workspace configuration
└── README.md
```

## Using Shared Templates

Both client and server import templates directly from the `shared/` folder:

```typescript
// In client
import { TemplateMinimalist } from '../../../shared/templates/TemplateMinimalist';

// In server
import { TemplateMinimalist } from '../shared/templates/TemplateMinimalist';
```

The templates work in both environments:
- **Client**: Renders preview using React (`mode="client"`)
- **Server**: Generates PDF using React Server Rendering (`mode="server"`)

## Building for Production

### Build Client

```bash
npm run build:client
# or
cd client && npm run build
```

Output will be in `client/dist/`

### Build Server

```bash
npm run build:server
# or
cd server && npm run build
```

This will:
1. Copy shared templates into `server/shared/`
2. Compile TypeScript to `server/dist/`

## Deployment

### Client Deployment
Deploy the `client/dist/` folder to any static hosting service (Vercel, Netlify, etc.)

### Server Deployment
See `server/DEPLOY.md` for detailed instructions. The server can be deployed to:
- Railway
- Render
- Any Docker-compatible platform

The build process automatically copies shared templates into the server directory, making it self-contained.

## Environment Variables

### Client (.env)
```
VITE_API_URL=http://localhost:8080
```

### Server (.env)
```
PORT=8080
PLAYWRIGHT_SECRET_KEY=your-secret-key
CORS_ORIGIN=http://localhost:5173
```

## Git Repository

Repository: `https://github.com/jillo-abdullahi/devCV.git`

All code is in a single monorepo with separate deployable client and server applications.

