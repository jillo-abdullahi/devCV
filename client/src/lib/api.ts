import type { ResumeData, TemplateId } from "@/types/resume";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const API_KEY = import.meta.env.VITE_API_KEY || "93iRk1fTXlIIKbwTie5LoWUlY++skD8LyIZPZ5oysl4=";

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export async function generatePDF(
  resumeData: ResumeData,
  templateId: TemplateId,
  pages?: string[]
): Promise<Blob> {
  const response = await fetch(`${API_URL}/generate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ resumeData, templateId, pages }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(
      error.error || "Failed to generate PDF",
      response.status,
      error.details
    );
  }

  return await response.blob();
}

export function downloadPDF(blob: Blob, filename: string = "resume.pdf") {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

export async function checkHealth(): Promise<{
  status: string;
  service: string;
}> {
  const response = await fetch(`${API_URL}/`);
  if (!response.ok) {
    throw new ApiError("Health check failed", response.status);
  }
  return await response.json();
}
