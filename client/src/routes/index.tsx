import { createFileRoute } from '@tanstack/react-router';
import { ResumeBuilder } from '@/components/ResumeBuilder';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className="mx-auto py-8">
      <ResumeBuilder />
    </div>
  );
}
