import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import Noir from '../mypreset';

import { provideHttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api'
import { GeminiApiService } from './core/services/gemini-api.service';
import { ResumeProcessingService } from './core/services/resume-processing-service.service';
import { ScreeningService } from './core/services/screening-service.service';
import { JobDescriptionService } from './core/services/job-description-service.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Noir,
        options: {
          darkModeSelector: false || 'none',
        },
      },
    }),
    provideHttpClient(), // Add this for HttpClient
    MessageService,
    GeminiApiService,
    ResumeProcessingService,
    ScreeningService,
    JobDescriptionService
  ],
};
