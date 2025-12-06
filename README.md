# DevCV

A modern, production-ready resume builder with live preview and PDF generation. Built as a monorepo with separately deployable client and server applications sharing the same resume templates.

## ✨ Features

- 🎨 **Live Preview**: Real-time resume preview as you type
- 📄 **PDF Generation**: High-quality PDF output using Playwright
- 🎯 **Template System**: Shared templates ensure preview matches PDF exactly
- 🚀 **Separate Deployment**: Client and server can be deployed independently
- 💪 **Type Safety**: Full TypeScript support across the stack
- 🎭 **Modern Stack**: React 19, Vite, TanStack Router, Express

## 📁 Project Structure

```
devcv/
├── client/          # React frontend (Vite + React + TanStack Router)
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── lib/         # API client
│   │   ├── routes/      # TanStack Router routes
│   │   └── stores/      # Zustand state management
│   └── package.json
├── server/          # Express backend (PDF generation)
│   ├── pdfGenerator.ts  # Playwright PDF generation
│   ├── server.ts       # Express API
│   ├── Dockerfile      # Docker configuration
│   └── DEPLOY.md       # Deployment guide
├── shared/          # Shared templates and types
│   ├── templates/      # Resume template components
│   ├── types.ts       # TypeScript types
│   └── templateConfigs.ts  # Font configurations
└── package.json     # Root workspace configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm

### Installation

```bash
npm install
```

### Development

Run both client and server:

```bash
npm run dev:all
```

Or run individually:

```bash
# Client (http://localhost:5173)
npm run dev:client

# Server (http://localhost:8080)
npm run dev:server
```

### Building for Production

```bash
# Build both
npm run build

# Or individually
npm run build:client
npm run build:server
```

## 🎨 How Templates Work

The key innovation is that **the same React components render both the live preview and the PDF**:

### Client Preview
```typescript
import { TemplateMinimalist } from '../../../shared/templates/TemplateMinimalist';

<TemplateMinimalist resumeData={data} mode="client" fontFamily={font} />
```

### Server PDF Generation
```typescript
import { TemplateMinimalist } from '../shared/templates/TemplateMinimalist';

const html = ReactDOMServer.renderToStaticMarkup(
  <TemplateMinimalist resumeData={data} mode="server" />
);
// Generate PDF from HTML using Playwright
```

This ensures **pixel-perfect consistency** between preview and PDF.

## 📦 Tech Stack

### Client
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **TanStack Router** - Type-safe routing
- **Tailwind CSS 4** - Styling
- **Zustand** - State management
- **TanStack Query** - Server state management

### Server
- **Express** - Web framework
- **Playwright** - Headless browser for PDF generation
- **TypeScript** - Type safety
- **React DOM Server** - SSR for PDF generation

### Shared
- **React** - Template components
- **TypeScript** - Shared types and interfaces

## 🚀 Deployment

### Client
Deploy `client/dist/` to any static hosting:
- Vercel
- Netlify
- Cloudflare Pages
- AWS S3 + CloudFront

### Server
Deploy server separately to:
- Railway (recommended - see `server/DEPLOY.md`)
- Render
- Fly.io
- Any Docker-compatible platform

The build process automatically copies shared templates into the server directory, making it self-contained.

## 🔧 Environment Variables

### Client
```env
VITE_API_URL=http://localhost:8080
```

### Server
```env
PORT=8080
PLAYWRIGHT_SECRET_KEY=your-secret-key
CORS_ORIGIN=http://localhost:5173
```

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start client dev server |
| `npm run dev:client` | Start client only |
| `npm run dev:server` | Start server only |
| `npm run dev:all` | Start both concurrently |
| `npm run build` | Build all workspaces |
| `npm run build:client` | Build client only |
| `npm run build:server` | Build server (with shared templates) |
| `npm run lint` | Lint all workspaces |
| `npm run clean` | Clean dependencies and build artifacts |

## 📚 Documentation

- [Quick Start Guide](./QUICKSTART.md)
- [Server Deployment Guide](./server/DEPLOY.md)
- [Client README](./client/README.md)
- [Server README](./server/README.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Built with React, Vite, and Playwright
- Template system inspired by modern resume builders
- Monorepo architecture for maintainability

