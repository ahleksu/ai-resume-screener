import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Editor } from 'primeng/editor';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';

// Import your services
import { ResumeProcessingService } from './core/services/resume-processing-service.service';
import { GeminiApiService } from './core/services/gemini-api.service';
import { JobDescriptionService } from './core/services/job-description-service.service';
import { ScreeningService } from './core/services/screening-service.service';

// Import your models
import { JobDescription } from './core/models/job-description';
import { ResumeAnalysis } from './core/models/resume-analysis';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    FormsModule,
    Editor,
    ButtonModule,
    FileUploadModule,
    ToastModule,
    ProgressBarModule,
    BadgeModule,
    OverlayBadgeModule,
    MessageModule,
    DialogModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'ai-resume-screener';
  text: string = ''; // Fix: Change from 'string | undefined' to 'string'
  totalSizePercent: number = 0; // Fix: Change from 'unknown' to 'number'
  totalSize: number = 0; // Fix: Change from 'any' to 'number'

  // File handling
  files: File[] = [];
  uploadedFiles: File[] = [];

  // Results
  results: ResumeAnalysis[] = [];
  isProcessing: boolean = false;

  constructor(
    private resumeProcessingService: ResumeProcessingService,
    private geminiApiService: GeminiApiService,
    private jobDescriptionService: JobDescriptionService,
    private screeningService: ScreeningService,
    private messageService: MessageService
  ) {}

  formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Handle file selection
  onSelect(event: any) {
    console.log('Files selected:', event.files);
    this.files = [...this.files, ...event.files];
    this.updateTotalSize();
  }

  // Handle file upload - Fix this method
  onUpload(event: any) {
    console.log('Files uploaded:', event.files);

    // Move files from pending to uploaded
    this.uploadedFiles = [...this.uploadedFiles, ...event.files];

    // Remove uploaded files from pending list
    this.files = this.files.filter((f) => !event.files.includes(f));

    this.updateTotalSize();

    // Auto-process if we have job description
    if (this.text.trim()) {
      this.processResumes();
    }
  }

  // Fix the progress calculation
  private updateTotalSize() {
    this.totalSize = this.files.reduce((acc, file) => acc + file.size, 0);
    this.totalSizePercent = Math.min((this.totalSize / 10000000) * 100, 100); // 10MB max
  }

  // Remove file from pending list
  onRemoveTemplatingFile(
    $event: MouseEvent,
    file: any,
    removeFileCallback: any,
    i: number
  ) {
    console.log('Removing file:', file);
    if (removeFileCallback) {
      removeFileCallback(i);
    }
    this.files.splice(i, 1);
    this.updateTotalSize();
  }

  // Remove file from uploaded list
  removeUploadedFileCallback(i: number) {
    console.log('Removing uploaded file at index:', i);
    this.uploadedFiles.splice(i, 1);
  }

  // Process uploaded resumes
  processResumes() {
    console.log('=== PROCESS RESUMES CALLED ===');
    console.log('text:', this.text);
    console.log('text length:', this.text?.length);
    console.log('uploadedFiles:', this.uploadedFiles);
    console.log('uploadedFiles length:', this.uploadedFiles.length);
    console.log('isProcessing:', this.isProcessing);

    if (!this.text?.trim()) {
      console.log('❌ No job description provided');
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter job description first',
      });
      return;
    }

    if (this.uploadedFiles.length === 0) {
      console.log('❌ No files uploaded');
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please upload at least one resume',
      });
      return;
    }

    console.log('✅ Starting resume processing...');
    this.isProcessing = true;
    this.results = [];

    console.log('Starting resume processing...');
    this.isProcessing = true;
    this.results = [];

    // Parse job description
    const jobDescription: JobDescription = {
      id: this.generateId(),
      title: 'Job Position',
      company: 'Company Name',
      description: this.text,
      requirements: this.extractRequirements(this.text),
      skills: this.extractSkills(this.text),
      experience: this.extractExperience(this.text),
      createdAt: new Date(),
    };

    console.log('Job description parsed:', jobDescription);

    // Process each resume
    this.uploadedFiles.forEach((file, index) => {
      console.log(
        `Processing resume ${index + 1}/${this.uploadedFiles.length}: ${
          file.name
        }`
      );

      this.resumeProcessingService.processResume(file).subscribe({
        next: (processedResume) => {
          console.log('Resume processed:', processedResume);

          // Send to Gemini for analysis
          this.geminiApiService
            .analyzeResumeWithJob(
              this.formatJobDescriptionForGemini(jobDescription),
              processedResume.extractedText,
              processedResume.hasPhoto,
              processedResume.photoBase64
            )
            .subscribe({
              next: (analysis) => {
                console.log('Gemini analysis received:', analysis);

                const resumeAnalysis: ResumeAnalysis = {
                  resumeId: this.generateId(),
                  fileName: processedResume.fileName,
                  score: analysis.score || 0,
                  strengths: analysis.strengths || [],
                  weaknesses: analysis.weaknesses || [],
                  skillsMatch: analysis.skillsMatch || [],
                  experienceMatch: analysis.experienceMatch || false,
                  summary: analysis.summary || 'No summary available',
                  hasPhoto: processedResume.hasPhoto,
                  photoBase64: processedResume.photoBase64 || null,
                };

                this.results.push(resumeAnalysis);

                // Sort results by score
                this.results.sort((a, b) => b.score - a.score);

                console.log('Updated results:', this.results);

                // Check if all resumes are processed
                if (this.results.length === this.uploadedFiles.length) {
                  this.isProcessing = false;
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: `Processed ${this.results.length} resumes successfully`,
                  });
                }
              },
              error: (error) => {
                console.error('Error in Gemini analysis:', error);
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: `Failed to analyze ${file.name}`,
                });
              },
            });
        },
        error: (error) => {
          console.error('Error processing resume:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Failed to process ${file.name}`,
          });
        },
      });
    });
  }

  // Helper methods
  private formatJobDescriptionForGemini(
    jobDescription: JobDescription
  ): string {
    return `
Job Title: ${jobDescription.title}
Company: ${jobDescription.company}
Description: ${jobDescription.description}
Required Skills: ${jobDescription.skills.join(', ')}
Requirements: ${jobDescription.requirements.join('\n')}
Experience: ${jobDescription.experience}
    `.trim();
  }

  private extractRequirements(text: string): string[] {
    // Simple extraction - you can make this more sophisticated
    const lines = text.split('\n').filter((line) => line.trim());
    return lines.filter(
      (line) =>
        line.toLowerCase().includes('requirement') ||
        line.toLowerCase().includes('must have') ||
        line.toLowerCase().includes('required')
    );
  }

  private extractSkills(text: string): string[] {
    // Simple extraction - you can make this more sophisticated
    const commonSkills = [
      'JavaScript',
      'TypeScript',
      'Angular',
      'React',
      'Node.js',
      'Python',
      'Java',
      'SQL',
    ];
    return commonSkills.filter((skill) =>
      text.toLowerCase().includes(skill.toLowerCase())
    );
  }

  private extractExperience(text: string): string {
    const experienceMatch = text.match(
      /(\d+)\+?\s*years?\s*(?:of\s*)?experience/i
    );
    return experienceMatch
      ? experienceMatch[0]
      : 'Experience level not specified';
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Getter for template
  get hasResults(): boolean {
    return this.results.length > 0;
  }

  getScoreColor(score: number): string {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-600';
  }

  getScoreBadgeClass(score: number): string {
    if (score >= 80) return 'bg-green-600';
    if (score >= 60) return 'bg-yellow-600';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-600';
  }

  getScoreLabel(score: number): string {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 50) return 'Poor';
    return 'Very Poor';
  }

  // Manual upload trigger
  manualUpload() {
    console.log('=== MANUAL UPLOAD TRIGGERED ===');
    console.log('Files to upload:', this.files);

    if (this.files.length > 0) {
      // Simulate the upload event
      this.onUpload({ files: [...this.files] });
    } else {
      console.log('No files to upload');
    }
  }

  // Add expansion state tracking
  expandedResults: { [key: string]: boolean } = {};

  // Toggle expansion for a specific result section
  toggleExpansion(resultId: string, section: string): void {
    const key = `${resultId}_${section}`;
    this.expandedResults[key] = !this.expandedResults[key];
  }

  // Check if section is expanded
  isExpanded(resultId: string, section: string): boolean {
    const key = `${resultId}_${section}`;
    return this.expandedResults[key] || false;
  }

  // Add photo display state (update your existing properties)
  selectedPhoto: string | null = null;
  showPhotoModal = false;
  isImageZoomed = false; // Add this new property

  // Update your showPhoto method
  showPhoto(photoBase64: string): void {
    console.log('📸 Showing photo modal');
    console.log('📸 Photo data length:', photoBase64?.length);
    console.log('📸 Photo preview:', photoBase64?.substring(0, 50) + '...');

    this.selectedPhoto = photoBase64;
    this.showPhotoModal = true;
    this.isImageZoomed = false; // Reset zoom state

    console.log('📸 Modal state:', this.showPhotoModal);
    console.log('📸 Selected photo set:', !!this.selectedPhoto);
  }

  // Update your hidePhoto method
  hidePhoto(): void {
    this.selectedPhoto = null;
    this.showPhotoModal = false;
    this.isImageZoomed = false; // Reset zoom state
  }

  // Add zoom functionality
  toggleImageZoom(event: Event): void {
    const img = event.target as HTMLImageElement;
    this.isImageZoomed = !this.isImageZoomed;

    if (this.isImageZoomed) {
      img.style.maxHeight = 'none';
      img.style.maxWidth = 'none';
      img.style.width = 'auto';
      img.style.height = 'auto';
      img.style.cursor = 'zoom-out';
    } else {
      img.style.maxHeight = '80vh';
      img.style.maxWidth = '100%';
      img.style.cursor = 'zoom-in';
    }
  }
}
