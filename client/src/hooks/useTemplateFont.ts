import { useEffect, useState } from 'react';
import { getTemplateConfig } from '../../../shared/templateConfigs';
import type { TemplateId } from '@/types/resume';

/**
 * Custom hook to load and apply template-specific fonts
 * 
 * This hook:
 * 1. Gets template configuration from the shared config
 * 2. Dynamically loads Google Fonts if specified in the template config
 * 3. Returns the fontFamily string to be used in component styles
 * 
 * This ensures the preview matches the downloaded PDF exactly by using
 * the same fonts defined in the shared template configuration.
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
    const loadTemplateFont = () => {
      try {
        const config = getTemplateConfig(templateId);
        
        if (config.googleFontsUrl) {
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
          
          // Wait for font to load before marking as ready
          link.onload = () => {
            setFontFamily(config.fontFamily);
            setIsLoading(false);
          };
          
          // Fallback in case onload doesn't fire
          setTimeout(() => {
            setFontFamily(config.fontFamily);
            setIsLoading(false);
          }, 100);
        } else {
          setFontFamily(config.fontFamily);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to load template font:', error);
        setFontFamily('sans-serif');
        setIsLoading(false);
      }
    };

    loadTemplateFont();
  }, [templateId]);

  return { fontFamily, isLoading };
};
