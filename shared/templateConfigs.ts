import type { TemplateConfig, TemplateId } from './types';

export const templateConfigs: Record<TemplateId, TemplateConfig> = {
  minimalist: {
    id: 'minimalist',
    name: 'Minimalist',
    fontFamily: "'Exo', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Exo:wght@400;500;600;700&display=swap',
    description: 'Clean and modern design with Exo font',
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    fontFamily: "'Roboto', 'Helvetica Neue', Arial, sans-serif",
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
    description: 'Classic professional look with Roboto font',
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    fontFamily: "'Poppins', 'Segoe UI', Tahoma, sans-serif",
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
    description: 'Contemporary design with Poppins font',
  },
};

export const getTemplateConfig = (templateId: TemplateId): TemplateConfig => {
  const config = templateConfigs[templateId];
  if (!config) {
    throw new Error(`Template configuration not found for: ${templateId}`);
  }
  return config;
};

export const getAllTemplateConfigs = (): TemplateConfig[] => {
  return Object.values(templateConfigs);
};
