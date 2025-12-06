import { useMutation } from '@tanstack/react-query';
import { useResumeStore } from '@/stores/resumeStore';
import { generatePDF, downloadPDF } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PersonalInfoForm } from './PersonalInfoForm';
import { ExperienceForm } from './ExperienceForm';
import { ProjectsForm } from './ProjectsForm';
import { EducationForm } from './EducationForm';
import { SkillsForm } from './SkillsForm';
import { SummaryForm } from './SummaryForm';

import { MultiPagePreview } from './MultiPagePreview';

import { useState } from 'react';

export function ResumeBuilder() {
  const { resumeData, selectedTemplate } = useResumeStore();
  const [paginatedHtml, setPaginatedHtml] = useState<string[]>([]);

  const generateMutation = useMutation({
    mutationFn: () => generatePDF(resumeData, selectedTemplate, paginatedHtml),
    onSuccess: (blob) => {
      downloadPDF(blob, `resume-${Date.now()}.pdf`);
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="w-full max-w-[2000px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[550px_1fr] gap-6 items-start">
          {/* Left Column - Form (scrolls with page) */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-8">
                {/* Personal Info Section */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                  <PersonalInfoForm />
                </div>

                {/* Summary Section */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">Professional Summary</h2>
                  <SummaryForm />
                </div>

                {/* Experience Section */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">Work Experience</h2>
                  <ExperienceForm />
                </div>

                {/* Projects Section */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
                  <ProjectsForm />
                </div>

                {/* Education Section */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">Education</h2>
                  <EducationForm />
                </div>

                {/* Skills Section */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
                  <SkillsForm />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Live Preview (wider, no scrollbar) */}
          <div className="lg:sticky lg:top-8 space-y-4">
            {/* Download Button - Above Preview */}
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-end">
                  <Button
                    onClick={() => generateMutation.mutate()}
                    disabled={generateMutation.isPending}
                    size="lg"
                  >
                    {generateMutation.isPending ? 'Generating...' : 'Download PDF'}
                  </Button>
                </div>
                {generateMutation.isError && (
                  <p className="text-destructive text-sm text-right mt-2">
                    Error: {(generateMutation.error as Error).message}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="overflow-hidden p-0">
              <CardContent className="p-0">
                <div style={{ height: 'calc(100vh - 180px)' }}>
                  <MultiPagePreview
                    resumeData={resumeData}
                    templateId={selectedTemplate}
                    onPagesChange={setPaginatedHtml}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
