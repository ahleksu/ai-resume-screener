import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { GeminiApiService } from './gemini-api.service';
import {
  ResumeProcessingService,
  ProcessedResume,
} from '../services/resume-processing-service.service';
import {
  JobDescription,
  Resume,
  ResumeAnalysis,
  ScreeningResult,
  RankedCandidate,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class ScreeningService {
  constructor(
    private geminiService: GeminiApiService,
    private resumeProcessingService: ResumeProcessingService
  ) {}

  screenResumes(
    jobDescription: JobDescription,
    resumes: File[]
  ): Observable<ScreeningResult> {
    const startTime = Date.now();

    // First, process all resumes to extract text and images
    return this.resumeProcessingService.processMultipleResumes(resumes).pipe(
      map((processedResumes) => {
        // Create analysis observables for each resume
        const analysisObservables = processedResumes.map((processedResume) =>
          this.analyzeResume(jobDescription, processedResume)
        );

        return forkJoin(analysisObservables);
      }),
      map((analysisObservables) => analysisObservables),
      map((analyses) => {
        const processingTime = Date.now() - startTime;

        return {
          id: this.generateId(),
          jobId: jobDescription.id || this.generateId(),
          resumeAnalyses: analyses,
          createdAt: new Date(),
          totalResumes: resumes.length,
          processingTime,
        } as unknown as ScreeningResult;
      }),
      catchError((error) => {
        console.error('Error screening resumes:', error);
        throw error;
      })
    );
  }

  private analyzeResume(
    jobDescription: JobDescription,
    processedResume: ProcessedResume
  ): Observable<ResumeAnalysis> {
    const jobDescriptionText = this.formatJobDescription(jobDescription);

    return this.geminiService
      .analyzeResumeWithJob(
        jobDescriptionText,
        processedResume.extractedText,
        processedResume.hasPhoto,
        processedResume.photoBase64
      )
      .pipe(
        map(
          (analysis) =>
            ({
              resumeId: this.generateId(),
              fileName: processedResume.fileName,
              score: analysis.score || 0,
              strengths: analysis.strengths || [],
              weaknesses: analysis.weaknesses || [],
              skillsMatch: analysis.skillsMatch || [],
              experienceMatch: analysis.experienceMatch || false,
              summary: analysis.summary || 'No summary available',
              hasPhoto: processedResume.hasPhoto,
            } as unknown as ResumeAnalysis)
        ),
        catchError((error) => {
          console.error(
            `Error analyzing resume ${processedResume.fileName}:`,
            error
          );
          // Return a default analysis in case of error
          return of({
            resumeId: this.generateId(),
            fileName: processedResume.fileName,
            score: 0,
            strengths: [],
            weaknesses: ['Error during analysis'],
            skillsMatch: [],
            experienceMatch: false,
            summary: 'Analysis failed due to processing error',
            hasPhoto: processedResume.hasPhoto,
          } as unknown as ResumeAnalysis);
        })
      );
  }

  rankCandidates(screeningResult: ScreeningResult): RankedCandidate[] {
    return screeningResult.resumeAnalyses
      .map((analysis, index) => ({
        resumeId: analysis.resumeId,
        fileName: analysis.fileName,
        score: analysis.score,
        rank: 0, // Will be set below
        analysis,
      }))
      .sort((a, b) => b.score - a.score) // Sort by score descending
      .map((candidate, index) => ({
        ...candidate,
        rank: index + 1,
      }));
  }

  getScoreColor(score: number): string {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-green-500';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-500';
    if (score >= 50) return 'text-red-500';
    return 'text-red-600';
  }

  getScoreLabel(score: number): string {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Moderate';
    if (score >= 50) return 'Weak';
    return 'Poor';
  }

  private formatJobDescription(jobDescription: JobDescription): string {
    return `
Job Title: ${jobDescription.title}
Company: ${jobDescription.company}
Location: ${jobDescription.location || 'Not specified'}
Experience Required: ${jobDescription.experience}

Job Description:
${jobDescription.description}

Required Skills:
${jobDescription.skills.join(', ')}

Requirements:
${jobDescription.requirements.join('\n')}
    `.trim();
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
