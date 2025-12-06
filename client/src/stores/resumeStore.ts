import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ResumeData, TemplateId } from '@/types/resume';

interface ResumeStore {
  resumeData: ResumeData;
  selectedTemplate: TemplateId;
  setResumeData: (data: Partial<ResumeData>) => void;
  setSelectedTemplate: (template: TemplateId) => void;
  resetResume: () => void;
}

const defaultResumeData: ResumeData = {
  personalInfo: {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: '',
  },
  summary: '',
  experience: [],
  projects: [],
  education: [],
  skills: [],
};

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      resumeData: defaultResumeData,
      selectedTemplate: 'minimalist',
      
      setResumeData: (data) =>
        set((state) => ({
          resumeData: { ...state.resumeData, ...data },
        })),
      
      setSelectedTemplate: (template) =>
        set({ selectedTemplate: template }),
      
      resetResume: () =>
        set({
          resumeData: defaultResumeData,
          selectedTemplate: 'minimalist',
        }),
    }),
    {
      name: 'resume-storage',
    }
  )
);
