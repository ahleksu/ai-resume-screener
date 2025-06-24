import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface GeminiRequest {
  contents: Array<{
    parts: Array<{
      text?: string;
      inline_data?: {
        mime_type: string;
        data: string;
      };
    }>;
  }>;
  generationConfig?: {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
  };
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

@Injectable({
  providedIn: 'root',
})
export class GeminiApiService {
  private readonly apiUrl =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  private readonly apiKey = environment.geminiApiKey; // Ensure you have this in your environment file

  constructor(private http: HttpClient) {}

  analyzeResumeWithJob(
    jobDescription: string,
    resumeText: string,
    hasPhoto: boolean,
    photoBase64?: string
  ): Observable<any> {
    const prompt = this.createAnalysisPrompt(
      jobDescription,
      resumeText,
      hasPhoto
    );

    const parts: any[] = [{ text: prompt }];

    // Add photo if present
    if (hasPhoto && photoBase64) {
      parts.push({
        inline_data: {
          mime_type: 'image/jpeg',
          data: photoBase64,
        },
      });
    }

    const request: GeminiRequest = {
      contents: [
        {
          parts: parts,
        },
      ],
      generationConfig: {
        temperature: 0.1,
        topK: 32,
        topP: 1,
        maxOutputTokens: 4096,
      },
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<GeminiResponse>(`${this.apiUrl}?key=${this.apiKey}`, request, {
        headers,
      })
      .pipe(
        map((response) => this.parseGeminiResponse(response)),
        catchError(this.handleError)
      );
  }

  private createAnalysisPrompt(
    jobDescription: string,
    resumeText: string,
    hasPhoto: boolean
  ): string {
    return `
      You are an HR Specialist trying to onboard applicants. Please analyze this resume against the job description and provide a detailed assessment.

      JOB DESCRIPTION:
      ${jobDescription}

      RESUME TEXT:
      ${resumeText}

      PHOTO PRESENT: ${hasPhoto ? 'Yes' : 'No'}

      Please provide your analysis in the following JSON format:
      {
        "score": <number between 0-100>,
        "strengths": ["strength1", "strength2", ...],
        "weaknesses": ["weakness1", "weakness2", ...],
        "skillsMatch": ["matched_skill1", "matched_skill2", ...],
        "experienceMatch": <boolean>,
        "summary": "<brief summary of the candidate's fit>",
        "reasoning": "<detailed explanation of the score>"
      }

      Focus on:
      1. Relevant skills and experience
      2. Education background
      3. Career progression
      4. Specific achievements
      5. Cultural fit indicators
      6. Any red flags or concerns

      Provide a score from 0-100 where:
      - 90-100: Excellent match, highly recommended
      - 80-89: Very good match, recommended
      - 70-79: Good match, consider for interview
      - 60-69: Moderate match, may need additional screening
      - 50-59: Weak match, likely not suitable
      - 0-49: Poor match, not recommended

      Be objective and professional in your assessment.
      `;
  }

  private parseGeminiResponse(response: GeminiResponse): any {
    try {
      const content = response.candidates[0]?.content?.parts[0]?.text;
      if (!content) {
        throw new Error('No content in Gemini response');
      }

      // Extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      throw new Error('No valid JSON found in response');
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      throw error;
    }
  }
  private handleError(error: any): Observable<never> {
    console.error('Gemini API Error:', error);
    return throwError(
      () => new Error(`Gemini API Error: ${error.message || error}`)
    );
  }
}
