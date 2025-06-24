import { ResumeAnalysis } from "./resume-analysis";

export interface RankedCandidate {
    resumeId: string;
    fileName: string;
    score: number;
    rank: number;
    analysis: ResumeAnalysis
}
