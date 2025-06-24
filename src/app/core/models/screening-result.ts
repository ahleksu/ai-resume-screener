import { ResumeAnalysis } from "./resume-analysis";

export interface ScreeningResult {
    id: string;
    jobId: string;
    resumeAnalyses: ResumeAnalysis[];
    createdAt: Date;
    totalResumes: number;
    processingTime: number;
}
