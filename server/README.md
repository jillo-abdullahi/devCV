# DevCVServer

A secure, standalone Node.js microservice for generating high-quality, vector-based PDF resumes using TypeScript, Playwright, and React templates.

## Features

- 🚀 **High-Performance PDF Generation**: Uses Playwright for crisp, vector-based PDF output
- 🎨 **React-Based Templates**: Server-side rendering of customizable resume templates
- 🔒 **Secure API**: Token-based authorization to protect endpoints
- 📦 **Docker Ready**: Container-optimized for deployment on Fly.io, Railway, or any container platform
- ✅ **Fully Typed**: TypeScript throughout for type safety and better developer experience
- 🧪 **Comprehensive Tests**: Jest-based test suite with high coverage

## Quick Start

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn

### Local Development

1. **Clone and Install Dependencies**

```bash
npm install
```

2. **Set Up Environment Variables**

```bash
cp .env.example .env
```

Edit `.env` and set your `PLAYWRIGHT_SECRET_KEY`:

```env
PLAYWRIGHT_SECRET_KEY=your-secure-random-key-here
PORT=8080
```

3. **Install Playwright Browsers**

```bash
npx playwright install chromium
```

4. **Start the Server**

```bash
npm start
```

The server will start on `http://localhost:8080`

### Testing

Run the test suite:

```bash
npm test
```

## API Usage

### Health Check

```bash
GET /
```

**Response:**
```json
{
  "status": "OK",
  "service": "DevCVServer",
  "version": "1.0.0",
  "timestamp": "2025-12-03T10:30:00.000Z"
}
```

### Generate PDF

```bash
POST /generate
```

**Headers:**
```
Authorization: Bearer your-secret-key-here
Content-Type: application/json
```

**Request Body:**
```json
{
  "templateId": "minimalist",
  "resumeData": {
    "personalInfo": {
      "name": "John Doe",
      "title": "Software Engineer",
      "email": "john@example.com",
      "phone": "+1 (555) 123-4567",
      "location": "San Francisco, CA",
      "linkedin": "linkedin.com/in/johndoe",
      "github": "github.com/johndoe"
    },
    "summary": "Experienced software engineer...",
    "experience": [
      {
        "company": "Tech Company",
        "position": "Senior Engineer",
        "location": "San Francisco, CA",
        "startDate": "Jan 2020",
        "endDate": "Present",
        "responsibilities": [
          "Led development of microservices",
          "Mentored junior developers"
        ]
      }
    ],
    "skills": ["JavaScript", "TypeScript", "React", "Node.js"]
  }
}
```

**Response:**
- Success: PDF file (Content-Type: application/pdf)
- Error: JSON error message

### Example with cURL

```bash
curl -X POST http://localhost:8080/generate \
  -H "Authorization: Bearer your-secret-key-here" \
  -H "Content-Type: application/json" \
  -d @resume-data.json \
  --output resume.pdf
```

### Example with JavaScript/TypeScript

```typescript
const response = await fetch('http://localhost:8080/generate', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.PLAYWRIGHT_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    templateId: 'minimalist',
    resumeData: { /* your resume data */ }
  })
});

const pdfBlob = await response.blob();
// Save or process the PDF
```

## Docker Deployment

### Build Docker Image

```bash
docker build -t devcvserver .
```

### Run Docker Container

```bash
docker run -p 8080:8080 \
  -e PLAYWRIGHT_SECRET_KEY=your-secret-key \
  devcvserver
```

## Deployment Platforms

### Fly.io

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`

2. Create `fly.toml`:

```toml
app = "devcvserver"

[build]
  dockerfile = "Dockerfile"

[env]
  PORT = "8080"

[[services]]
  internal_port = 8080
  protocol = "tcp"

  [[services.ports]]
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443
```

3. Deploy:

```bash
fly launch
fly secrets set PLAYWRIGHT_SECRET_KEY=your-secret-key
fly deploy
```

### Railway

1. Connect your GitHub repository to Railway
2. Set environment variable: `PLAYWRIGHT_SECRET_KEY`
3. Railway will auto-detect Dockerfile and deploy

## Data Schema

See `mockData.ts` for complete TypeScript interfaces:

- `ResumeData`: Main resume structure
- `PersonalInfo`: Contact information
- `ExperienceItem`: Work experience
- `ProjectItem`: Projects/portfolio items
- `EducationItem`: Educational background

## Available Templates

Currently supported templates:

- **minimalist**: Clean, professional design optimized for ATS systems

More templates can be added by creating new React components in the same pattern as `TemplateMinimalist.tsx`.

## Architecture

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ POST /generate
       ▼
┌─────────────────┐
│  Express Server │
│   (server.ts)   │
└──────┬──────────┘
       │
       ▼
┌──────────────────┐      ┌────────────────┐
│  PDF Generator   │─────▶│   Playwright   │
│ (pdfGenerator.ts)│      │    Browser     │
└──────┬───────────┘      └────────────────┘
       │
       ▼
┌─────────────────┐
│ React Templates │
│(TemplateMin.tsx)│
└─────────────────┘
```

## Performance Considerations

- **Browser Reuse**: The service maintains a single Playwright browser instance across requests for optimal performance
- **Resource Management**: Pages are closed after each PDF generation to prevent memory leaks
- **Concurrent Requests**: Can handle multiple concurrent PDF generation requests efficiently

## Security

- **Authorization Required**: All PDF generation requests require a valid secret key
- **Input Validation**: Request data is validated before processing
- **Docker Sandboxing**: Running in Docker provides isolation and security

## Troubleshooting

### Playwright Installation Issues

If you encounter browser download errors:

```bash
npx playwright install-deps chromium
npx playwright install chromium
```

### Memory Issues

For high-traffic scenarios, consider:
- Increasing container memory limits
- Implementing request queuing
- Running multiple instances behind a load balancer

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Support

For issues or questions, please open a GitHub issue.
