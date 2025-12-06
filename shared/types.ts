// Resume data types
export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface ExperienceItem {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  responsibilities: string[];
}

export interface ProjectItem {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
}

export interface EducationItem {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary?: string;
  experience: ExperienceItem[];
  projects?: ProjectItem[];
  education?: EducationItem[];
  skills?: string[];
}

export type TemplateId = 'minimalist' | 'professional' | 'modern';

// Template configuration
export interface TemplateConfig {
  id: TemplateId;
  name: string;
  fontFamily: string;
  googleFontsUrl?: string;
  description?: string;
}
