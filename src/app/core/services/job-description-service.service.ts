import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { JobDescription } from '../models/job-description';

@Injectable({
  providedIn: 'root'
})
export class JobDescriptionService {
  private currentJobSubject = new BehaviorSubject<JobDescription | null>(null);
  public currentJob$ = this.currentJobSubject.asObservable();

  private jobHistorySubject = new BehaviorSubject<JobDescription[]>([]);
  public jobHistory$ = this.jobHistorySubject.asObservable();

  constructor() {
    this.loadJobHistory();
  }

  setCurrentJob(jobDescription: JobDescription): void {
    const jobWithId = {
      ...jobDescription,
      id: jobDescription.id || this.generateId(),
      createdAt: jobDescription.createdAt || new Date()
    };
    
    this.currentJobSubject.next(jobWithId);
    this.addToHistory(jobWithId);
  }

  getCurrentJob(): JobDescription | null {
    return this.currentJobSubject.value;
  }

  clearCurrentJob(): void {
    this.currentJobSubject.next(null);
  }

  private addToHistory(jobDescription: JobDescription): void {
    const currentHistory = this.jobHistorySubject.value;
    const updatedHistory = [jobDescription, ...currentHistory.filter(job => job.id !== jobDescription.id)];
    
    // Keep only last 10 jobs
    const trimmedHistory = updatedHistory.slice(0, 10);
    
    this.jobHistorySubject.next(trimmedHistory);
    this.saveJobHistory(trimmedHistory);
  }

  private saveJobHistory(history: JobDescription[]): void {
    try {
      localStorage.setItem('jobHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Error saving job history:', error);
    }
  }

  private loadJobHistory(): void {
    try {
      const saved = localStorage.getItem('jobHistory');
      if (saved) {
        const history = JSON.parse(saved);
        this.jobHistorySubject.next(history);
      }
    } catch (error) {
      console.error('Error loading job history:', error);
    }
  }

  validateJobDescription(jobDescription: Partial<JobDescription>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!jobDescription.title?.trim()) {
      errors.push('Job title is required');
    }

    if (!jobDescription.company?.trim()) {
      errors.push('Company name is required');
    }

    if (!jobDescription.description?.trim()) {
      errors.push('Job description is required');
    }

    if (!jobDescription.skills || jobDescription.skills.length === 0) {
      errors.push('At least one skill is required');
    }

    if (!jobDescription.requirements || jobDescription.requirements.length === 0) {
      errors.push('At least one requirement is required');
    }

    if (!jobDescription.experience?.trim()) {
      errors.push('Experience requirement is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  parseJobDescriptionFromText(text: string): Partial<JobDescription> {
    // Simple parsing logic - you might want to enhance this
    const lines = text.split('\n').filter(line => line.trim());
    
    return {
      title: this.extractTitle(lines),
      company: this.extractCompany(lines),
      description: text,
      skills: this.extractSkills(text),
      requirements: this.extractRequirements(text),
      experience: this.extractExperience(text),
      location: this.extractLocation(lines)
    };
  }

  private extractTitle(lines: string[]): string {
    // Look for common job title patterns
    const titlePatterns = [
      /job title[:\s]+(.*)/i,
      /position[:\s]+(.*)/i,
      /role[:\s]+(.*)/i
    ];

    for (const pattern of titlePatterns) {
      for (const line of lines) {
        const match = line.match(pattern);
        if (match) {
          return match[1].trim();
        }
      }
    }

    return lines[0] || 'Job Title';
  }

  private extractCompany(lines: string[]): string {
    const companyPatterns = [
      /company[:\s]+(.*)/i,
      /organization[:\s]+(.*)/i,
      /employer[:\s]+(.*)/i
    ];

    for (const pattern of companyPatterns) {
      for (const line of lines) {
        const match = line.match(pattern);
        if (match) {
          return match[1].trim();
        }
      }
    }

    return 'Company Name';
  }

  private extractSkills(text: string): string[] {
    const skillsSection = text.match(/(?:skills|technologies|tools)[:\s]+(.*?)(?:\n\n|\n[A-Z]|$)/is);
    if (skillsSection) {
      return skillsSection[1]
        .split(/[,\n•·-]/)
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);
    }
    return [];
  }

  private extractRequirements(text: string): string[] {
    const requirementsSection = text.match(/(?:requirements|qualifications|must have)[:\s]+(.*?)(?:\n\n|\n[A-Z]|$)/is);
    if (requirementsSection) {
      return requirementsSection[1]
        .split(/\n/)
        .map(req => req.replace(/^[•·-]\s*/, '').trim())
        .filter(req => req.length > 0);
    }
    return [];
  }

  private extractExperience(text: string): string {
    const experiencePatterns = [
      /(\d+)\+?\s*years?\s*(?:of\s*)?experience/i,
      /experience[:\s]+(\d+\+?\s*years?)/i,
      /minimum[:\s]+(\d+\+?\s*years?)/i
    ];

    for (const pattern of experiencePatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1] || match[0];
      }
    }

    return 'Experience level not specified';
  }

  private extractLocation(lines: string[]): string {
    const locationPatterns = [
      /location[:\s]+(.*)/i,
      /based in[:\s]+(.*)/i,
      /office[:\s]+(.*)/i
    ];

    for (const pattern of locationPatterns) {
      for (const line of lines) {
        const match = line.match(pattern);
        if (match) {
          return match[1].trim();
        }
      }
    }

    return '';
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}