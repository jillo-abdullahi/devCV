import { useResumeStore } from '@/stores/resumeStore';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export function SummaryForm() {
  const { resumeData, setResumeData } = useResumeStore();

  return (
    <div className="space-y-2">
      <Label htmlFor="summary">Professional Summary</Label>
      <Textarea
        id="summary"
        value={resumeData.summary || ''}
        onChange={(e) => setResumeData({ summary: e.target.value })}
        placeholder="Brief overview of your professional experience and goals..."
        rows={6}
      />
    </div>
  );
}
