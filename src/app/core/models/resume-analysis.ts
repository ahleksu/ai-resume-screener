export interface ResumeAnalysis {
  photoBase64: any;
  resumeId: string;
  fileName: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
  skillsMatch: string[];
  experienceMatch: boolean;
  summary: string;
  hasPhoto: boolean;
}
