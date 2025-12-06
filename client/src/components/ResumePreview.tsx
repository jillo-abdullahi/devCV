import type { ResumeData, TemplateId } from '@/types/resume';
import { useTemplateFont } from '@/hooks/useTemplateFont';
import { getTemplate } from '../../../shared/templates';

interface ResumePreviewProps {
  resumeData: ResumeData;
  templateId: TemplateId;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({
  resumeData,
  templateId,
}) => {
  const { fontFamily, isLoading } = useTemplateFont(templateId);
  const Template = getTemplate(templateId);

  if (isLoading) {
    return (
      <div className="bg-white w-full h-full flex items-center justify-center">
        <p className="text-gray-500">Loading template...</p>
      </div>
    );
  }

  return (
    <Template 
      resumeData={resumeData} 
      mode="client"
      fontFamily={fontFamily}
    />
  );
};
