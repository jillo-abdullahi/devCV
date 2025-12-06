import type { TemplateId } from '../types';
import { TemplateMinimalist, type TemplateProps } from './TemplateMinimalist';

export type { TemplateProps };

export const templates = {
  minimalist: TemplateMinimalist,
  professional: TemplateMinimalist, // TODO: Add professional template
  modern: TemplateMinimalist, // TODO: Add modern template
} as const;

export const getTemplate = (templateId: TemplateId) => {
  return templates[templateId] || templates.minimalist;
};

export { TemplateMinimalist };
