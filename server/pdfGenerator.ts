import { chromium, Browser, Page } from 'playwright';
import ReactDOMServer from 'react-dom/server';
import React from 'react';
import { ResumeData } from './mockData';
import { TemplateMinimalist } from '../shared/templates/TemplateMinimalist';

// Cached browser instance for reuse across requests
let browserInstance: Browser | null = null;

/**
 * Get or create a browser instance
 * Reuses existing instance if available, creates new one if needed
 */
async function getBrowser(): Promise<Browser> {
  if (browserInstance && browserInstance.isConnected()) {
    return browserInstance;
  }

  try {
    browserInstance = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });

    // Handle browser disconnection
    browserInstance.on('disconnected', () => {
      console.log('Browser disconnected, clearing instance');
      browserInstance = null;
    });

    return browserInstance;
  } catch (error) {
    browserInstance = null;
    throw new Error(`Failed to launch browser: ${error}`);
  }
}

/**
 * Reset the browser instance (useful for error recovery)
 */
async function resetBrowser(): Promise<void> {
  if (browserInstance) {
    try {
      await browserInstance.close();
    } catch (error) {
      console.error('Error closing browser:', error);
    }
    browserInstance = null;
  }
}

/**
 * Render a React template to static HTML string
 * @param resumeData - Resume data to render
 * @param templateId - Template identifier (currently only 'minimalist' is supported)
 * @returns HTML string
 */
export function renderTemplateToHtml(resumeData: ResumeData, templateId: string): string {
  if (!resumeData) {
    throw new Error('Resume data is required');
  }

  if (!templateId) {
    throw new Error('Template ID is required');
  }

  let TemplateComponent;

  switch (templateId.toLowerCase()) {
    case 'minimalist':
      TemplateComponent = TemplateMinimalist;
      break;
    default:
      throw new Error(`Unknown template ID: ${templateId}`);
  }

  try {
    let htmlContent = ReactDOMServer.renderToStaticMarkup(
      React.createElement(TemplateComponent, { resumeData, mode: 'server' })
    );
    
    // Fix HTML entity encoding in CSS (React escapes quotes to &#x27;)
    // This breaks font-family declarations like font-family: 'Exo'
    htmlContent = htmlContent.replace(/&#x27;/g, "'");

    console.log(`Rendered HTML for template: ${htmlContent}`);

    return `<!DOCTYPE html>${htmlContent}`;
  } catch (error) {
    throw new Error(`Failed to render template: ${error}`);
  }
}

/**
 * Generate a PDF buffer from resume data
 * @param resumeData - Resume data to convert to PDF
 * @param templateId - Template identifier to use for rendering
 * @returns Promise resolving to PDF Buffer
 */
export async function generatePdfBuffer(
  resumeData: ResumeData,
  templateId: string
): Promise<Buffer> {
  let page: Page | null = null;

  try {
    // Validate inputs
    if (!resumeData) {
      throw new Error('Resume data is required');
    }

    if (!templateId) {
      throw new Error('Template ID is required');
    }

    if (!resumeData.personalInfo) {
      throw new Error('Personal info is required in resume data');
    }

    // Render template to HTML
    const htmlContent = renderTemplateToHtml(resumeData, templateId);

    // Get browser instance
    const browser = await getBrowser();

    // Create new page
    page = await browser.newPage();

    // Navigate to blank page and set content
    await page.goto('about:blank');
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait for fonts to load
    await page.evaluateHandle('document.fonts.ready');

    // Generate PDF with high-quality settings
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0',
        bottom: '0',
        left: '0',
        right: '0'
      },
      preferCSSPageSize: true,
      displayHeaderFooter: false
    });

    return pdfBuffer;
  } catch (error) {
    console.error('Error generating PDF:', error);

    // Reset browser on critical errors
    if (error instanceof Error && 
        (error.message.includes('Target closed') || 
         error.message.includes('Browser closed') ||
         error.message.includes('disconnected'))) {
      await resetBrowser();
    }

    throw new Error(`PDF generation failed: ${error}`);
  } finally {
    // Always close the page to free resources
    if (page) {
      try {
        await page.close();
      } catch (error) {
        console.error('Error closing page:', error);
      }
    }
  }
}

/**
 * Graceful shutdown - close browser instance
 */
export async function shutdown(): Promise<void> {
  console.log('Shutting down PDF generator...');
  await resetBrowser();
}
