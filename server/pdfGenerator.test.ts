import { renderTemplateToHtml, generatePdfBuffer, shutdown } from './pdfGenerator';
import { ResumeData, mockResumeData } from './mockData';
import { chromium } from 'playwright';

// Create mock instances that persist across tests
const mockPage = {
  goto: jest.fn().mockResolvedValue(null),
  setContent: jest.fn().mockResolvedValue(null),
  pdf: jest.fn().mockResolvedValue(Buffer.from('mock-pdf-content')),
  close: jest.fn().mockResolvedValue(null),
};

const mockBrowser = {
  newPage: jest.fn().mockResolvedValue(mockPage),
  close: jest.fn().mockResolvedValue(null),
  isConnected: jest.fn().mockReturnValue(true),
  on: jest.fn(),
};

// Mock Playwright
jest.mock('playwright', () => ({
  chromium: {
    launch: jest.fn(),
  },
}));

describe('pdfGenerator', () => {
  beforeEach(async () => {
    // Reset mock implementations and call counts
    jest.clearAllMocks();
    
    // Shutdown any cached browser instance before each test
    await shutdown();
    
    // Reset browser launch mock to return our mock browser
    (chromium.launch as jest.Mock).mockResolvedValue(mockBrowser);
    mockBrowser.newPage.mockResolvedValue(mockPage);
    mockBrowser.isConnected.mockReturnValue(true);
    mockPage.pdf.mockResolvedValue(Buffer.from('mock-pdf-content'));
  });

  afterAll(async () => {
    // Clean up after all tests
    await shutdown();
  });

  describe('renderTemplateToHtml', () => {
    it('should render resume data to HTML string', () => {
      const html = renderTemplateToHtml(mockResumeData, 'minimalist');

      expect(html).toBeTruthy();
      expect(typeof html).toBe('string');
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain(mockResumeData.personalInfo.name);
      expect(html).toContain(mockResumeData.personalInfo.email);
      expect(html).toContain(mockResumeData.personalInfo.title);
    });

    it('should include all experience data in HTML', () => {
      const html = renderTemplateToHtml(mockResumeData, 'minimalist');

      mockResumeData.experience.forEach((exp) => {
        expect(html).toContain(exp.company);
        expect(html).toContain(exp.position);
      });
    });

    it('should include projects in HTML', () => {
      const html = renderTemplateToHtml(mockResumeData, 'minimalist');

      mockResumeData.projects?.forEach((project) => {
        expect(html).toContain(project.name);
        expect(html).toContain(project.description);
      });
    });

    it('should include CSS page settings for A4', () => {
      const html = renderTemplateToHtml(mockResumeData, 'minimalist');

      expect(html).toContain('@page');
      expect(html).toContain('size: A4');
      expect(html).toContain('margin: 0');
    });

    it('should throw error if resumeData is missing', () => {
      expect(() => {
        renderTemplateToHtml(null as any, 'minimalist');
      }).toThrow('Resume data is required');
    });

    it('should throw error if templateId is missing', () => {
      expect(() => {
        renderTemplateToHtml(mockResumeData, '');
      }).toThrow('Template ID is required');
    });

    it('should throw error for unknown template ID', () => {
      expect(() => {
        renderTemplateToHtml(mockResumeData, 'unknown-template');
      }).toThrow('Unknown template ID');
    });
  });

  describe('generatePdfBuffer', () => {
    it('should return a Buffer', async () => {
      const result = await generatePdfBuffer(mockResumeData, 'minimalist');

      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should launch browser with correct arguments', async () => {
      await generatePdfBuffer(mockResumeData, 'minimalist');

      expect(chromium.launch).toHaveBeenCalledWith(
        expect.objectContaining({
          headless: true,
          args: expect.arrayContaining([
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
          ])
        })
      );
    });

    it('should navigate to blank page and set content', async () => {
      await generatePdfBuffer(mockResumeData, 'minimalist');

      expect(mockPage.goto).toHaveBeenCalledWith('about:blank');
      expect(mockPage.setContent).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          waitUntil: 'networkidle',
          timeout: 30000
        })
      );
    });

    it('should call page.pdf with high-quality configuration', async () => {
      await generatePdfBuffer(mockResumeData, 'minimalist');

      expect(mockPage.pdf).toHaveBeenCalledWith({
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
    });

    it('should close the page after generating PDF', async () => {
      await generatePdfBuffer(mockResumeData, 'minimalist');

      expect(mockPage.close).toHaveBeenCalled();
    });

    it('should throw error if resumeData is missing', async () => {
      await expect(
        generatePdfBuffer(null as any, 'minimalist')
      ).rejects.toThrow('Resume data is required');
    });

    it('should throw error if templateId is missing', async () => {
      await expect(
        generatePdfBuffer(mockResumeData, '')
      ).rejects.toThrow('Template ID is required');
    });

    it('should throw error if personalInfo is missing', async () => {
      const invalidData = { ...mockResumeData, personalInfo: null as any };

      await expect(
        generatePdfBuffer(invalidData, 'minimalist')
      ).rejects.toThrow('Personal info is required');
    });

    it('should handle PDF generation errors gracefully', async () => {
      // Mock PDF generation failure
      mockPage.pdf.mockRejectedValueOnce(new Error('PDF generation failed'));

      await expect(
        generatePdfBuffer(mockResumeData, 'minimalist')
      ).rejects.toThrow('PDF generation failed');

      // Page should still be closed
      expect(mockPage.close).toHaveBeenCalled();
    });

    it('should reuse browser instance for multiple calls', async () => {
      await generatePdfBuffer(mockResumeData, 'minimalist');
      await generatePdfBuffer(mockResumeData, 'minimalist');

      // Browser should only be launched once
      expect(chromium.launch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Template content validation', () => {
    it('should include all required sections in rendered HTML', () => {
      const html = renderTemplateToHtml(mockResumeData, 'minimalist');

      // Check for section titles
      expect(html).toContain('Professional Summary');
      expect(html).toContain('Professional Experience');
      expect(html).toContain('Notable Projects');
      expect(html).toContain('Education');
      expect(html).toContain('Technical Skills');
    });

    it('should render skills as tags', () => {
      const html = renderTemplateToHtml(mockResumeData, 'minimalist');

      mockResumeData.skills?.forEach((skill) => {
        expect(html).toContain(skill);
      });
    });

    it('should render responsibilities as list items', () => {
      const html = renderTemplateToHtml(mockResumeData, 'minimalist');

      const firstExp = mockResumeData.experience[0];
      firstExp.responsibilities.forEach((resp) => {
        expect(html).toContain(resp);
      });
    });
  });
});
