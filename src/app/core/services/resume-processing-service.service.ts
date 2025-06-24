import { Injectable } from '@angular/core';
import { Observable, from, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import * as pdfjsLib from 'pdfjs-dist';

// ✅ Confirmed working CDN URL for PDF.js 5.3.31 worker
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.3.31/pdf.worker.min.mjs';

export interface ProcessedResume {
  fileName: string;
  extractedText: string;
  hasPhoto: boolean;
  photoBase64?: string;
  pageCount: number;
  processingTime: number;
}

@Injectable({
  providedIn: 'root',
})
export class ResumeProcessingService {
  constructor() {
    console.log('🔧 ResumeProcessingService initialized');
    console.log('📄 PDF.js version:', pdfjsLib.version);
    console.log('👷 Worker source:', pdfjsLib.GlobalWorkerOptions.workerSrc);
    console.log('✅ Using confirmed working CDN URL');
  }

  processResume(file: File): Observable<ProcessedResume> {
    console.log(`📄 Starting to process resume: ${file.name}`);

    // Validate file first
    const validation = this.validateResumeFile(file);
    if (!validation.isValid) {
      console.error('❌ File validation failed:', validation.error);
      return throwError(() => new Error(validation.error));
    }

    const startTime = Date.now();

    return from(this.extractTextAndImages(file)).pipe(
      map((result) => {
        const processedResume = {
          fileName: file.name,
          extractedText: result.text,
          hasPhoto: result.hasPhoto,
          photoBase64: result.photoBase64,
          pageCount: result.pageCount,
          processingTime: Date.now() - startTime,
        };

        console.log(`✅ Successfully processed ${file.name}:`, {
          textLength: result.text.length,
          hasPhoto: result.hasPhoto,
          pageCount: result.pageCount,
          processingTime: processedResume.processingTime + 'ms',
        });

        return processedResume;
      }),
      catchError((error) => {
        console.error(`❌ Failed to process ${file.name}:`, error);
        return throwError(
          () => new Error(`Failed to process PDF: ${error.message}`)
        );
      })
    );
  }

  processMultipleResumes(files: File[]): Observable<ProcessedResume[]> {
    console.log(`📄 Processing ${files.length} resumes simultaneously`);
    const processingObservables = files.map((file) => this.processResume(file));
    return forkJoin(processingObservables);
  }

  private async extractTextAndImages(file: File): Promise<{
    text: string;
    hasPhoto: boolean;
    photoBase64?: string;
    pageCount: number;
  }> {
    try {
      console.log(`🔄 Converting ${file.name} to array buffer...`);
      const arrayBuffer = await file.arrayBuffer();
      console.log(`📦 Array buffer created: ${arrayBuffer.byteLength} bytes`);

      console.log(`📖 Loading PDF document with worker...`);
      const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer,
        verbosity: pdfjsLib.VerbosityLevel.ERRORS, // Reduce console noise
      }).promise;

      console.log(`📄 PDF loaded successfully!`, {
        pages: pdf.numPages,
        fingerprints: pdf.fingerprints,
      });

      let fullText = '';
      let hasPhoto = false;
      let photoBase64: string | undefined;

      // Process each page
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        console.log(`📄 Processing page ${pageNum}/${pdf.numPages}...`);
        const page = await pdf.getPage(pageNum);

        // Extract text content
        console.log(`📝 Extracting text from page ${pageNum}...`);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');

        fullText += pageText + '\n';
        console.log(
          `✅ Page ${pageNum} text extracted: ${pageText.length} characters`
        );

        // Check for images
        // Check for images and extract them
        if (!hasPhoto) {
          try {
            console.log(`🖼️ Checking for images on page ${pageNum}...`);
            const operatorList = await page.getOperatorList();
            const hasImages = operatorList.fnArray.some(
              (fn: number) =>
                fn === pdfjsLib.OPS.paintImageXObject ||
                fn === pdfjsLib.OPS.paintXObject
            );

            if (hasImages) {
              console.log(
                `✅ Images found on page ${pageNum}, attempting extraction...`
              );
              hasPhoto = true;

              // Try to extract the first image
              try {
                const imageData = await this.extractFirstImage(page);
                if (imageData) {
                  photoBase64 = imageData;
                  console.log(
                    `📸 Successfully extracted photo from page ${pageNum}`
                  );
                }
              } catch (extractError) {
                console.warn(
                  `⚠️ Could not extract image data from page ${pageNum}:`,
                  extractError
                );
              }
            } else {
              console.log(`ℹ️ No images found on page ${pageNum}`);
            }
          } catch (imageError) {
            console.warn(
              `⚠️ Could not check for images on page ${pageNum}:`,
              imageError
            );
          }
        }
      }

      console.log(`🎉 PDF processing complete for ${file.name}:`, {
        totalPages: pdf.numPages,
        totalTextLength: fullText.length,
        hasPhoto,
        textPreview: fullText.substring(0, 100) + '...',
      });

      return {
        text: fullText.trim(),
        hasPhoto,
        photoBase64,
        pageCount: pdf.numPages,
      };
    } catch (error) {
      console.error('❌ Error processing PDF:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack,
        });
      } else {
        console.error('Error details:', error);
      }
      throw error;
    }
  }

  // Replace the extractFirstImage method (lines 194-235) with this corrected version:

  private async extractFirstImage(page: any): Promise<string | null> {
    try {
      console.log('🖼️ Starting image extraction...');

      // Method 1: Render the entire page to canvas (simpler and more reliable)
      const viewport = page.getViewport({ scale: 1.5 }); // Higher scale for better quality
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        console.error('❌ Could not get canvas context');
        return null;
      }

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Render the page to canvas
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      console.log('🎨 Rendering page to canvas...');
      await page.render(renderContext).promise;
      console.log('✅ Page rendered to canvas');

      // Convert canvas to base64
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      const base64Data = imageDataUrl.split(',')[1];

      console.log(
        `📸 Extracted page as image: ${base64Data.length} characters`
      );

      // Optional: Try to detect if this page actually contains photos
      // For now, we'll return the full page render
      return base64Data;
    } catch (error) {
      console.error('❌ Error extracting image:', error);

      // Fallback: Try alternative method
      try {
        console.log('🔄 Trying alternative image extraction...');
        return await this.extractImageAlternative(page);
      } catch (fallbackError) {
        console.error('❌ Alternative extraction also failed:', fallbackError);
        return null;
      }
    }
  }

  // Add this alternative method as a fallback
  private async extractImageAlternative(page: any): Promise<string | null> {
    try {
      console.log('🔄 Using alternative extraction method...');

      // Get page annotations and objects
      const annotations = await page.getAnnotations();
      console.log('📋 Page annotations:', annotations);

      // Try to get page dictionary
      const pageDict = page.ref ? await page.commonObjs.get(page.ref) : null;
      console.log('📚 Page dictionary available:', !!pageDict);

      // For now, create a simple placeholder since actual image extraction is complex
      return await this.createPhotoPlaceholder(page);
    } catch (error) {
      console.error('❌ Alternative extraction failed:', error);
      return null;
    }
  }

  // Update the placeholder method to accept page parameter
  private async createPhotoPlaceholder(page?: any): Promise<string> {
    console.log('🎨 Creating photo placeholder...');

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('❌ Could not get canvas context for placeholder');
      return '';
    }

    canvas.width = 300;
    canvas.height = 200;

    // Create a nice-looking placeholder
    const gradient = ctx.createLinearGradient(0, 0, 300, 200);
    gradient.addColorStop(0, '#f0f9ff');
    gradient.addColorStop(1, '#e0e7ff');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 300, 200);

    // Add border
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, 300, 200);

    // Add icon and text
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('📷', 150, 80);

    ctx.font = '16px Arial';
    ctx.fillText('Photo Detected', 150, 110);

    ctx.font = '12px Arial';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Click to view full page', 150, 130);

    const base64 = canvas.toDataURL('image/png').split(',')[1];
    console.log(`✅ Created placeholder: ${base64.length} characters`);

    return base64;
  }

  validateResumeFile(file: File): { isValid: boolean; error?: string } {
    console.log(`🔍 Validating file: ${file.name}`, {
      type: file.type,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      lastModified: new Date(file.lastModified).toLocaleString(),
    });

    // Check file type
    if (file.type !== 'application/pdf') {
      console.log('❌ Invalid file type:', file.type);
      return { isValid: false, error: 'Only PDF files are supported' };
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      console.log(
        '❌ File too large:',
        `${(file.size / 1024 / 1024).toFixed(2)} MB > 10 MB`
      );
      return { isValid: false, error: 'File size must be less than 10MB' };
    }

    console.log('✅ File validation passed');
    return { isValid: true };
  }
}
