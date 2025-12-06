import { useResumeStore } from '@/stores/resumeStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function PersonalInfoForm() {
  const { resumeData, setResumeData } = useResumeStore();
  const { personalInfo } = resumeData;

  const updateField = (field: string, value: string) => {
    setResumeData({
      personalInfo: { ...personalInfo, [field]: value },
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={personalInfo.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Professional Title *</Label>
          <Input
            id="title"
            value={personalInfo.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Senior Software Engineer"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={personalInfo.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="john@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            value={personalInfo.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location *</Label>
        <Input
          id="location"
          value={personalInfo.location}
          onChange={(e) => updateField('location', e.target.value)}
          placeholder="San Francisco, CA"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            id="linkedin"
            value={personalInfo.linkedin || ''}
            onChange={(e) => updateField('linkedin', e.target.value)}
            placeholder="linkedin.com/in/johndoe"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="github">GitHub</Label>
          <Input
            id="github"
            value={personalInfo.github || ''}
            onChange={(e) => updateField('github', e.target.value)}
            placeholder="github.com/johndoe"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={personalInfo.website || ''}
            onChange={(e) => updateField('website', e.target.value)}
            placeholder="johndoe.dev"
          />
        </div>
      </div>
    </div>
  );
}
