import { useEffect, useState } from 'react';
import { getTemplates } from '@/lib/api';
import type { TemplateId } from '@/types/resume';

/**
 * Custom hook to load and apply template-specific fonts from the backend
 * 
 * This hook:
 * 1. Fetches template configuration from the backend API
 * 2. Dynamically loads Google Fonts if specified in the template config
 * 3. Returns the fontFamily string to be used in component styles
 * 
 * This ensures the preview matches the downloaded PDF exactly by using
 * the same fonts defined in the backend template configuration.
 * 
 * @param templateId - The ID of the template to load fonts for
 * @returns Object containing fontFamily string and loading state
 * 
 * @example
 * const { fontFamily, isLoading } = useTemplateFont('minimalist');
 * 
 * if (isLoading) return <div>Loading...</div>;
 * 
 * return <div style={{ fontFamily }}>{content}</div>;
 */
export const useTemplateFont = (templateId: TemplateId) => {
  const [fontFamily, setFontFamily] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTemplateFont = async () => {
      try {
        setIsLoading(true);
        const data = await getTemplates();
        const config = data.templates.find(t => t.id === templateId);
        
        if (config?.googleFontsUrl) {
          // Create unique ID for this font link
          const linkId = `font-${templateId}`;
          
          // Remove previous font link if it exists
          const existingLink = document.getElementById(linkId);
          if (existingLink) {
            existingLink.remove();
          }
          
          // Add new font link
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = config.googleFontsUrl;
          link.id = linkId;
          document.head.appendChild(link);
        }
        
        setFontFamily(config?.fontFamily || 'sans-serif');
      } catch (error) {
        console.error('Failed to load template font:', error);
        setFontFamily('sans-serif');
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplateFont();
  }, [templateId]);

  return { fontFamily, isLoading };
};
