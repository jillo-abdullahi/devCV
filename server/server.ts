import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { generatePdfBuffer, shutdown } from './pdfGenerator';
import { ResumeData } from './mockData';
import { templateConfigs } from '../shared/templateConfigs';

const app = express();
const PORT = process.env.PORT || 8080;
const SECRET_KEY = process.env.PLAYWRIGHT_SECRET_KEY;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));

// Authorization middleware
function authorizeMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!SECRET_KEY) {
    console.warn('WARNING: PLAYWRIGHT_SECRET_KEY is not set. Authorization is disabled.');
    next();
    return;
  }

  if (!authHeader) {
    res.status(401).json({ error: 'Authorization header is required' });
    return;
  }

  // Support both "Bearer <token>" and direct token formats
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.substring(7)
    : authHeader;

  if (token !== SECRET_KEY) {
    res.status(403).json({ error: 'Invalid authorization token' });
    return;
  }

  next();
}

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    service: 'DevCVServer',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Get available templates endpoint
app.get('/templates', (req: Request, res: Response) => {
  const templates = Object.values(templateConfigs).map(config => ({
    id: config.id,
    name: config.name,
    description: config.description,
    fontFamily: config.fontFamily,
    googleFontsUrl: config.googleFontsUrl,
  }));

  res.status(200).json({ templates });
});

// Main PDF generation endpoint
app.post('/generate', authorizeMiddleware, async (req: Request, res: Response) => {
  try {
    const { resumeData, templateId, pages } = req.body;

    // Validate request body
    if (!resumeData) {
      res.status(400).json({ error: 'resumeData is required in request body' });
      return;
    }

    if (!templateId) {
      res.status(400).json({ error: 'templateId is required in request body' });
      return;
    }

    // Validate resumeData structure
    if (!resumeData.personalInfo) {
      res.status(400).json({
        error: 'resumeData.personalInfo is required',
        details: 'personalInfo must include name, title, email, phone, and location'
      });
      return;
    }

    // Type assertion for resume data
    const typedResumeData = resumeData as ResumeData;

    console.log(`Generating PDF for: ${typedResumeData.personalInfo.name} with template: ${templateId}`);

    // Generate PDF
    const pdfBuffer = await generatePdfBuffer(typedResumeData, templateId, pages);

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="resume-${Date.now()}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send PDF buffer
    res.send(pdfBuffer);

    console.log(`PDF generated successfully (${pdfBuffer.length} bytes)`);
  } catch (error) {
    console.error('Error in /generate endpoint:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    res.status(500).json({
      error: 'Failed to generate PDF',
      details: errorMessage
    });
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    details: err.message
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`DevCVServer is running on port ${PORT}`);
  console.log(`Authorization: ${SECRET_KEY ? 'Enabled' : 'Disabled (set PLAYWRIGHT_SECRET_KEY to enable)'}`);
});

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);

  server.close(async () => {
    console.log('HTTP server closed');
    await shutdown();
    console.log('Shutdown complete');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
