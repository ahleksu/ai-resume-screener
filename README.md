# 🤖 AI Resume Screener

![Angular](https://img.shields.io/badge/Angular-19.2-red?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)
![PrimeNG](https://img.shields.io/badge/PrimeNG-19.1-purple)
![License](https://img.shields.io/badge/License-MIT-green)

An intelligent, AI-powered web application that automates resume screening for HR professionals and recruiters. Built with Angular 19 and powered by Google's Gemini 2.0 Flash API, it analyzes both textual content and visual elements of PDF resumes to provide objective, explainable candidate evaluations.

---

## 📋 Table of Contents

- [Features](#-features)
- [Architecture Overview](#️-architecture-overview)
- [Technology Stack](#️-technology-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Application](#running-the-application)
- [Project Structure](#-project-structure)
- [Core Services](#-core-services)
- [Data Models](#-data-models)
- [AI Integration](#-ai-integration)
- [Scaling Considerations](#-scaling-considerations)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## ✨ Features

### Current Features (MVP)

- **📄 PDF Resume Processing**: Extracts text and images from PDF resumes using PDF.js
- **🤖 AI-Powered Analysis**: Uses Google Gemini 2.0 Flash for multimodal resume evaluation
- **📊 Objective Scoring**: Generates 0-100 match scores with detailed reasoning
- **🔍 Skill Matching**: Automatically identifies and matches candidate skills with job requirements
- **📸 Photo Analysis**: Detects and displays resume photos for professional presentation assessment
- **⚡ Batch Processing**: Handles multiple resumes simultaneously (up to 50 per batch)
- **📈 Ranked Results**: Automatically sorts candidates by match score
- **🎯 Explainable AI**: Provides transparent strengths, weaknesses, and reasoning for each score
- **🎨 Modern UI**: Built with PrimeNG and Tailwind CSS for intuitive user experience
- **🔒 Privacy-First**: No server-side data storage; all processing happens client-side

---

## 🏗️ Architecture Overview

The application follows a **service-oriented architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                   Presentation Layer                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │       AppComponent (Main UI Controller)              │  │
│  │  - Job Description Editor (PrimeNG Editor)           │  │
│  │  - File Upload Interface (Drag & Drop)               │  │
│  │  - Results Display & Ranking                         │  │
│  │  - Photo Modal Viewer                                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Service Layer                             │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │  Screening       │  │  Job Description │               │
│  │  Service         │  │  Service         │               │
│  │  (Orchestrator)  │  │  (State Mgmt)    │               │
│  └────────┬─────────┘  └──────────────────┘               │
│           ↓                                                 │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │  Resume          │  │  Gemini API      │               │
│  │  Processing      │  │  Service         │               │
│  │  Service         │  │  (AI Analysis)   │               │
│  │  (PDF.js)        │  │                  │               │
│  └──────────────────┘  └──────────────────┘               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                 External Dependencies                        │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │  PDF.js 5.3.31   │  │  Google Gemini   │               │
│  │  (Text & Image   │  │  2.0 Flash API   │               │
│  │   Extraction)    │  │  (AI Analysis)   │               │
│  └──────────────────┘  └──────────────────┘               │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Input**: User enters job description and uploads PDF resumes
2. **PDF Processing**: `ResumeProcessingService` extracts text and images using PDF.js
3. **AI Analysis**: `GeminiApiService` sends job description + resume data to Gemini API
4. **Result Aggregation**: `ScreeningService` combines analyses and ranks candidates
5. **UI Update**: Results displayed with expandable details, scoring, and photo modals

---

## 🛠️ Technology Stack

### Frontend Framework
- **Angular 19.2** - Modern TypeScript-based framework
- **RxJS 7.8** - Reactive programming for async operations
- **TypeScript 5.7** - Strict typing for maintainability

### UI Libraries
- **PrimeNG 19.1** - Rich UI component library
  - Editor (Quill-based rich text editor)
  - FileUpload (drag-and-drop with progress)
  - Dialog, Toast, ProgressBar, Badge components
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **PrimeIcons 7.0** - Icon library

### PDF Processing
- **PDF.js 5.3.31** - Mozilla's PDF rendering library for text and image extraction

### AI/ML
- **Google Gemini 2.0 Flash API** - Multimodal large language model for resume analysis

### Development Tools
- **Angular CLI 19.2.15** - Build tooling and scaffolding
- **Jasmine & Karma** - Testing framework

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.x or higher ([Download](https://nodejs.org/))
- **npm**: v9.x or higher (comes with Node.js)
- **Angular CLI**: v19.x
  ```bash
  npm install -g @angular/cli@19
  ```
- **Google Gemini API Key**: Get one from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ahleksu/ai-resume-screener.git
   cd ai-resume-screener
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Verify installation**
   ```bash
   ng version
   ```
   
   Expected output:
   ```
   Angular CLI: 19.2.15
   Node: 18.x.x
   Package Manager: npm 9.x.x
   OS: win32 x64
   ```

### Configuration

1. **Set up environment files**
   
   The project uses environment files to store API keys. You need to update the following files:

   **`src/environments/environment.ts`** (Production):
   ```typescript
   export const environment = {
     production: true,
     geminiApiKey: 'YOUR_GEMINI_API_KEY_HERE'
   };
   ```

   **`src/environments/environment.development.ts`** (Development):
   ```typescript
   export const environment = {
     production: false,
     geminiApiKey: 'YOUR_DEVELOPMENT_API_KEY_HERE'
   };
   ```

   ⚠️ **Security Note**: 
   - Never commit API keys to version control
   - Consider using environment variables for production deployments
   - The `.gitignore` file should exclude environment files with sensitive data

2. **Obtain Google Gemini API Key**
   
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Create a new API key
   - Copy the key and paste it in your environment files

### Running the Application

#### Development Server

```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`. The app will automatically reload when you change source files.

#### Development Server with Host Access

To access from other devices on your network:
```bash
ng serve --host 0.0.0.0
```

Then access via `http://YOUR_LOCAL_IP:4200`

#### Production Build

```bash
npm run build
# or
ng build --configuration production
```

Build artifacts will be stored in the `dist/ai-resume-screener/` directory.

#### Watch Mode (Development)

```bash
npm run watch
```

Continuously builds the project as you make changes.

---

## 📁 Project Structure

```
ai-resume-screener/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── models/              # TypeScript interfaces
│   │   │   │   ├── index.ts         # Barrel export
│   │   │   │   ├── job-description.ts
│   │   │   │   ├── resume.ts
│   │   │   │   ├── resume-analysis.ts
│   │   │   │   ├── screening-result.ts
│   │   │   │   └── ranked-candidate.ts
│   │   │   └── services/            # Business logic services
│   │   │       ├── gemini-api.service.ts
│   │   │       ├── gemini-api.service.spec.ts
│   │   │       ├── resume-processing-service.service.ts
│   │   │       ├── resume-processing-service.service.spec.ts
│   │   │       ├── screening-service.service.ts
│   │   │       ├── screening-service.service.spec.ts
│   │   │       ├── job-description-service.service.ts
│   │   │       └── job-description-service.service.spec.ts
│   │   ├── app.component.ts         # Main application component
│   │   ├── app.component.html       # Main template
│   │   ├── app.component.css        # Component styles
│   │   ├── app.component.spec.ts    # Component tests
│   │   ├── app.config.ts            # Application configuration
│   │   └── app.routes.ts            # Routing configuration
│   ├── environments/                # Environment configs
│   │   ├── environment.ts           # Production config
│   │   └── environment.development.ts # Development config
│   ├── styles.css                   # Global styles
│   ├── mypreset.ts                  # PrimeNG theme preset
│   ├── index.html                   # HTML entry point
│   └── main.ts                      # Application bootstrap
├── public/                          # Static assets
├── .angular/                        # Angular build cache (gitignored)
├── node_modules/                    # Dependencies (gitignored)
├── angular.json                     # Angular workspace config
├── package.json                     # npm dependencies & scripts
├── package-lock.json                # Dependency lock file
├── tsconfig.json                    # TypeScript config (base)
├── tsconfig.app.json                # App-specific TS config
├── tsconfig.spec.json               # Test TS config
├── .editorconfig                    # Editor configuration
├── .gitignore                       # Git ignore rules
└── README.md                        # This file
```

### Key Directories Explained

- **`src/app/core/models`**: TypeScript interfaces defining data structures for job descriptions, resumes, analyses, and results
- **`src/app/core/services`**: Singleton services containing business logic (PDF processing, AI analysis, orchestration)
- **`src/environments`**: Environment-specific configuration (API keys, feature flags)
- **`public`**: Static assets like images, fonts, and manifest files

---

## 🔧 Core Services

### 1. `ResumeProcessingService`

Handles PDF parsing and data extraction.

**Location**: `src/app/core/services/resume-processing-service.service.ts`

**Responsibilities**:
- PDF text extraction using PDF.js
- Image detection and extraction from resumes
- Multi-page resume support
- File validation (type, size)
- Batch processing capabilities

**Key Methods**:
```typescript
// Process a single resume
processResume(file: File): Observable<ProcessedResume>

// Process multiple resumes in parallel
processMultipleResumes(files: File[]): Observable<ProcessedResume[]>

// Validate resume file before processing
validateResumeFile(file: File): { isValid: boolean; error?: string }
```

**Configuration**:
```typescript
// PDF.js worker configuration (using CDN)
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.3.31/pdf.worker.min.mjs';
```

**Features**:
- ✅ Extracts text from all pages
- ✅ Detects and extracts photos (JPEG/PNG)
- ✅ Handles various PDF formats (Word, Google Docs, LaTeX)
- ✅ Provides detailed processing metrics (time, page count)
- ✅ Robust error handling

---

### 2. `GeminiApiService`

Integrates with Google's Gemini 2.0 Flash API for AI-powered resume analysis.

**Location**: `src/app/core/services/gemini-api.service.ts`

**Responsibilities**:
- Constructs AI prompts for resume analysis
- Sends multimodal requests (text + images) to Gemini API
- Parses structured JSON responses
- Error handling and retries
- Response validation

**Key Methods**:
```typescript
// Analyze resume against job description
analyzeResumeWithJob(
  jobDescription: string,
  resumeText: string,
  hasPhoto: boolean,
  photoBase64?: string
): Observable<any>
```

**API Configuration**:
```typescript
generationConfig: {
  temperature: 0.1,      // Low temperature for consistent results
  topK: 32,
  topP: 1,
  maxOutputTokens: 4096
}
```

**Prompt Engineering**:
The service uses a carefully crafted prompt that:
1. Provides context (job description + resume content)
2. Requests specific JSON format for structured output
3. Defines scoring rubric (0-100 scale with interpretations)
4. Focuses on relevant skills, experience, achievements, and red flags
5. Requests explainable reasoning for transparency

**Expected JSON Response**:
```json
{
  "score": 85,
  "strengths": [
    "5+ years experience in relevant field",
    "Strong technical skills matching job requirements",
    "Proven leadership experience"
  ],
  "weaknesses": [
    "Limited experience with specific technology X",
    "Frequent job changes may indicate job-hopping"
  ],
  "skillsMatch": ["JavaScript", "React", "Node.js", "SQL"],
  "experienceMatch": true,
  "summary": "Strong candidate with relevant technical background...",
  "reasoning": "Detailed explanation of scoring rationale..."
}
```

---

### 3. `ScreeningService`

Orchestrates the complete screening workflow by coordinating resume processing and AI analysis.

**Location**: `src/app/core/services/screening-service.service.ts`

**Responsibilities**:
- Coordinates PDF processing and AI analysis
- Aggregates results from multiple resumes
- Ranks candidates by score
- Provides score interpretation helpers (colors, labels)

**Key Methods**:
```typescript
// Screen multiple resumes against a job description
screenResumes(
  jobDescription: JobDescription,
  resumes: File[]
): Observable<ScreeningResult>

// Rank candidates by score
rankCandidates(screeningResult: ScreeningResult): RankedCandidate[]

// Get color coding for scores
getScoreColor(score: number): string

// Get human-readable score label
getScoreLabel(score: number): string
```

**Workflow**:
```
1. Validate inputs (job description, resume files)
   ↓
2. Process all PDFs in parallel (ResumeProcessingService)
   ↓
3. Analyze each resume with Gemini API (parallel)
   ↓
4. Aggregate results into ScreeningResult
   ↓
5. Rank candidates by score (highest first)
   ↓
6. Return ranked results with metadata
```

**Score Interpretation**:
- **90-100**: 🟢 Excellent match (green)
- **80-89**: 🟢 Very good match (green)
- **70-79**: 🟡 Good match (yellow)
- **60-69**: 🟡 Moderate match (yellow)
- **40-59**: 🟠 Weak match (orange)
- **0-39**: 🔴 Poor match (red)

---

### 4. `JobDescriptionService`

Manages job description state, validation, and persistence.

**Location**: `src/app/core/services/job-description-service.service.ts`

**Responsibilities**:
- Job description CRUD operations
- LocalStorage persistence for job history
- Job description validation
- Text parsing for skills, requirements, experience levels

**Key Methods**:
```typescript
// Set current active job description
setCurrentJob(jobDescription: JobDescription): void

// Get current job description
getCurrentJob(): JobDescription | null

// Clear current job
clearCurrentJob(): void

// Validate job description
validateJobDescription(
  jobDescription: Partial<JobDescription>
): { isValid: boolean; errors: string[] }

// Parse job description from raw text
parseJobDescriptionFromText(text: string): Partial<JobDescription>
```

---

## 📊 Data Models

All models are defined in `src/app/core/models/` and exported via `src/app/core/models/index.ts`.

### `JobDescription`

Represents a job posting with all relevant details.

```typescript
export interface JobDescription {
  id?: string;              // Unique identifier
  title: string;            // Job title (e.g., "Senior Software Engineer")
  company: string;          // Company name
  description: string;      // Full job description (rich text)
  requirements: string[];   // List of requirements
  skills: string[];         // Required/desired skills
  experience: string;       // Experience level (e.g., "5+ years")
  location?: string;        // Job location
  salary?: string;          // Salary range
  createdAt?: Date;         // Creation timestamp
}
```

### `Resume`

Represents an uploaded resume file and its metadata.

```typescript
export interface Resume {
  id?: string;              // Unique identifier
  fileName: string;         // Original file name
  file: File;               // File object
  extractedText?: string;   // Extracted text content
  hasPhoto?: boolean;       // Whether resume contains a photo
  photoUrl?: string;        // URL or base64 of photo
  uploadedAt?: Date;        // Upload timestamp
  processingStatus?: 'pending' | 'processing' | 'completed' | 'error';
}
```

### `ResumeAnalysis`

Contains AI-generated analysis results for a single resume.

```typescript
export interface ResumeAnalysis {
  resumeId: string;         // Reference to resume
  fileName: string;         // Original file name
  score: number;            // Match score (0-100)
  strengths: string[];      // List of strengths (3-6 items)
  weaknesses: string[];     // List of weaknesses (2-5 items)
  skillsMatch: string[];    // Matched skills from job description
  experienceMatch: boolean; // Whether experience requirement is met
  summary: string;          // 2-3 sentence overview
  hasPhoto: boolean;        // Whether resume has a photo
  photoBase64?: string;     // Base64 encoded photo
}
```

### `ScreeningResult`

Aggregates all analyses for a screening session.

```typescript
export interface ScreeningResult {
  id: string;                       // Unique identifier
  jobId: string;                    // Reference to job description
  resumeAnalyses: ResumeAnalysis[]; // All resume analyses
  createdAt: Date;                  // Creation timestamp
  totalResumes: number;             // Total resumes processed
  processingTime: number;           // Total time in milliseconds
}
```

### `RankedCandidate`

Represents a candidate with ranking information.

```typescript
export interface RankedCandidate {
  resumeId: string;         // Reference to resume
  fileName: string;         // Original file name
  score: number;            // Match score (0-100)
  rank: number;             // 1-based ranking (1 = best)
  analysis: ResumeAnalysis; // Full analysis details
}
```

---

## 🤖 AI Integration

### Gemini API Setup

The application uses Google's **Gemini 2.0 Flash** model for multimodal analysis:

```
Endpoint: https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
Method: POST
Authentication: API Key (query parameter)
```

### Request Format

```typescript
{
  contents: [
    {
      parts: [
        { 
          text: "<system prompt + job description + resume text>" 
        },
        { 
          inline_data: { 
            mime_type: "image/jpeg",
            data: "<base64_encoded_photo>"
          }
        }
      ]
    }
  ],
  generationConfig: {
    temperature: 0.1,      // Deterministic results
    topK: 32,
    topP: 1,
    maxOutputTokens: 4096
  }
}
```

### Prompt Structure

The AI prompt includes:

1. **System Context**: "You are an HR Specialist trying to onboard applicants..."
2. **Job Description**: Full job posting details
3. **Resume Content**: Extracted text from PDF
4. **Photo Status**: Whether photo is present
5. **Analysis Instructions**: Focus areas (skills, experience, achievements, red flags)
6. **Output Format**: Strict JSON schema for structured responses
7. **Scoring Rubric**: Clear definitions for score ranges (0-100)

### Cost Optimization

- **Temperature**: Set to 0.1 for consistent, deterministic results
- **Token Limits**: Balanced to provide detail while managing costs
- **Batch Processing**: Process multiple resumes in parallel when possible
- **Estimated Cost**: ~$0.05-0.10 per resume analysis

---

## 📈 Scaling Considerations

### Current Architecture (MVP)

**Type**: Client-side Single Page Application (SPA)  
**Processing**: Browser-based with direct API calls  
**Storage**: No persistent storage (stateless)

**Strengths**:
- ✅ Simple deployment (static hosting)
- ✅ Privacy-first (no data retention)
- ✅ Low infrastructure costs
- ✅ Fast iteration and development

**Limitations**:
- ❌ API key exposed to client (security risk)
- ❌ No user authentication or accounts
- ❌ Limited to browser capabilities
- ❌ Rate limits apply per client
- ❌ No historical data or analytics

---

### Scaling Path: Backend Integration

For production use with multiple organizations, consider this evolution:

#### **Phase 1: Current MVP**
```
├── Angular SPA (client-side)
└── Direct Gemini API calls
```

#### **Phase 2: Backend Gateway**
```
├── Angular Frontend
├── Node.js/Express Backend
│   ├── API Gateway (secures Gemini API key)
│   ├── Authentication (JWT)
│   ├── Rate Limiting (per user/org)
│   └── Usage Tracking
└── Gemini API (server-side only)
```

#### **Phase 3: Full Platform**
```
├── Angular Frontend (Web)
├── React Native (Mobile - future)
├── Node.js Backend (NestJS)
├── PostgreSQL Database
│   ├── Users & Organizations
│   ├── Job Descriptions (templates)
│   ├── Screening History
│   └── Analytics & Metrics
├── Redis Cache (job descriptions, API responses)
├── AWS S3 / Azure Blob (resume storage)
├── Background Job Queue (BullMQ for async processing)
└── API Gateway (rate limiting, authentication)
```

---

### Backend Architecture Recommendation

**Recommended Tech Stack**:
```yaml
Runtime: Node.js 20+
Framework: NestJS (TypeScript, enterprise-ready)
Database: PostgreSQL 15+ with Prisma ORM
Cache: Redis 7+ (job descriptions, API responses)
Queue: BullMQ (async resume processing)
Storage: AWS S3 or Azure Blob Storage
Auth: JWT with refresh tokens
API Docs: Swagger/OpenAPI
Monitoring: Sentry (errors) + DataDog (metrics)
Hosting: AWS ECS / Azure Container Apps / GCP Cloud Run
```

**Proposed Backend Structure**:
```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/              # Authentication & authorization
│   │   ├── users/             # User management
│   │   ├── organizations/     # Multi-tenant support
│   │   ├── jobs/              # Job descriptions
│   │   ├── resumes/           # Resume upload & storage
│   │   ├── screening/         # Screening orchestration
│   │   ├── analytics/         # Usage analytics
│   │   └── billing/           # Subscription & usage billing
│   ├── common/
│   │   ├── guards/            # Auth guards
│   │   ├── decorators/        # Custom decorators
│   │   ├── filters/           # Exception filters
│   │   └── interceptors/      # Logging, caching
│   ├── config/                # Configuration management
│   ├── database/              # Prisma schema & migrations
│   └── main.ts                # Application entry point
├── prisma/
│   └── schema.prisma          # Database schema
├── test/                      # E2E tests
├── Dockerfile
├── docker-compose.yml
└── package.json
```

---

### Database Schema (Prisma Example)

```prisma
// Organization (multi-tenant)
model Organization {
  id        String   @id @default(uuid())
  name      String
  apiKey    String   @unique      // For API access
  tier      Tier     @default(FREE)
  users     User[]
  jobs      Job[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Tier {
  FREE
  STARTER
  PROFESSIONAL
  ENTERPRISE
}

// User accounts
model User {
  id             String       @id @default(uuid())
  email          String       @unique
  passwordHash   String
  role           Role         @default(RECRUITER)
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  jobs           Job[]
  createdAt      DateTime     @default(now())
}

enum Role {
  ADMIN
  RECRUITER
  HIRING_MANAGER
  VIEWER
}

// Job descriptions
model Job {
  id             String            @id @default(uuid())
  title          String
  description    String            @db.Text
  requirements   String[]
  skills         String[]
  experience     String
  organizationId String
  organization   Organization      @relation(fields: [organizationId], references: [id])
  screenings     ScreeningResult[]
  createdBy      User              @relation(fields: [userId], references: [id])
  userId         String
  createdAt      DateTime          @default(now())
  updatedAt      DateTime          @updatedAt
}

// Uploaded resumes
model Resume {
  id             String           @id @default(uuid())
  fileName       String
  s3Key          String           // S3/Blob storage key
  extractedText  String           @db.Text
  hasPhoto       Boolean
  photoS3Key     String?          // Separate key for photo
  uploadedAt     DateTime         @default(now())
  analyses       ResumeAnalysis[]
}

// Screening sessions
model ScreeningResult {
  id              String           @id @default(uuid())
  jobId           String
  job             Job              @relation(fields: [jobId], references: [id])
  totalResumes    Int
  processingTime  Int              // Milliseconds
  resumeAnalyses  ResumeAnalysis[]
  createdAt       DateTime         @default(now())
}

// Individual resume analyses
model ResumeAnalysis {
  id               String          @id @default(uuid())
  resumeId         String
  resume           Resume          @relation(fields: [resumeId], references: [id])
  screeningId      String
  screening        ScreeningResult @relation(fields: [screeningId], references: [id])
  score            Int
  strengths        String[]
  weaknesses       String[]
  skillsMatch      String[]
  experienceMatch  Boolean
  summary          String          @db.Text
  createdAt        DateTime        @default(now())
  
  @@index([score])
  @@index([createdAt])
}
```

---

### API Rate Limiting Strategy

```typescript
// Rate limit tiers
const RATE_LIMITS = {
  FREE: { 
    resumesPerDay: 50,
    resumesPerHour: 10,
    concurrentJobs: 1
  },
  STARTER: { 
    resumesPerDay: 500,
    resumesPerHour: 50,
    concurrentJobs: 3
  },
  PROFESSIONAL: { 
    resumesPerDay: 2000,
    resumesPerHour: 200,
    concurrentJobs: 10
  },
  ENTERPRISE: { 
    resumesPerDay: 10000,
    resumesPerHour: 1000,
    concurrentJobs: 50
  }
};

// Implement with Redis
import { RateLimiterRedis } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'resume_screening',
  points: RATE_LIMITS[userTier].resumesPerHour,
  duration: 3600, // 1 hour
});
```

---

### Caching Strategy

```typescript
// Redis cache keys
const CACHE_KEYS = {
  jobDescription: (jobId: string) => `job:${jobId}`,
  resumeText: (resumeId: string) => `resume:text:${resumeId}`,
  geminiResponse: (jobId: string, resumeId: string) => 
    `analysis:${jobId}:${resumeId}`,
  userQuota: (userId: string, date: string) => 
    `quota:${userId}:${date}`
};

// Cache TTLs (Time To Live)
const CACHE_TTL = {
  jobDescription: 3600,      // 1 hour
  resumeText: 86400,         // 24 hours
  geminiResponse: 604800,    // 7 days (analyses rarely change)
  userQuota: 86400           // 24 hours (reset daily)
};

// Usage example
async function getCachedAnalysis(jobId: string, resumeId: string) {
  const key = CACHE_KEYS.geminiResponse(jobId, resumeId);
  const cached = await redis.get(key);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  // If not cached, perform analysis
  const analysis = await performAnalysis(jobId, resumeId);
  
  // Cache for future use
  await redis.setex(
    key, 
    CACHE_TTL.geminiResponse, 
    JSON.stringify(analysis)
  );
  
  return analysis;
}
```

---

### Horizontal Scaling with Docker

**docker-compose.yml** (multi-instance deployment):

```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - api-1
      - api-2
      - api-3

  api-1:
    build: ./backend
    environment:
      - NODE_ENV=production
      - REDIS_URL=redis://redis:6379
      - DATABASE_URL=postgresql://user:pass@postgres:5432/resume_screener
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    depends_on:
      - postgres
      - redis

  api-2:
    build: ./backend
    environment:
      - NODE_ENV=production
      - REDIS_URL=redis://redis:6379
      - DATABASE_URL=postgresql://user:pass@postgres:5432/resume_screener
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    depends_on:
      - postgres
      - redis

  api-3:
    build: ./backend
    environment:
      - NODE_ENV=production
      - REDIS_URL=redis://redis:6379
      - DATABASE_URL=postgresql://user:pass@postgres:5432/resume_screener
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=resume_screener
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"

  bull-queue:
    build: ./backend
    command: npm run start:queue
    environment:
      - NODE_ENV=production
      - REDIS_URL=redis://redis:6379
      - DATABASE_URL=postgresql://user:pass@postgres:5432/resume_screener
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    depends_on:
      - redis
      - postgres

volumes:
  postgres_data:
  redis_data:
```

---

## 🧪 Testing

### Running Tests

```bash
# Run all unit tests
npm test
# or
ng test

# Run tests with coverage report
ng test --code-coverage

# Run tests in headless mode (CI/CD)
ng test --watch=false --browsers=ChromeHeadless

# Run tests for specific file
ng test --include='**/gemini-api.service.spec.ts'
```

### Test Coverage

View coverage reports in `coverage/ai-resume-screener/index.html` after running tests with `--code-coverage`.

**Coverage Goals**:
- **Services**: 85%+ coverage
- **Components**: 70%+ coverage
- **Models**: 100% (interface validation)

### Test Structure

```
src/app/
├── app.component.spec.ts
└── core/
    └── services/
        ├── gemini-api.service.spec.ts
        ├── resume-processing-service.service.spec.ts
        ├── screening-service.service.spec.ts
        └── job-description-service.service.spec.ts
```

### Example Test

```typescript
describe('ScreeningService', () => {
  let service: ScreeningService;
  let geminiSpy: jasmine.SpyObj<GeminiApiService>;
  let resumeSpy: jasmine.SpyObj<ResumeProcessingService>;

  beforeEach(() => {
    const geminiSpyObj = jasmine.createSpyObj('GeminiApiService', 
      ['analyzeResumeWithJob']);
    const resumeSpyObj = jasmine.createSpyObj('ResumeProcessingService', 
      ['processMultipleResumes']);

    TestBed.configureTestingModule({
      providers: [
        ScreeningService,
        { provide: GeminiApiService, useValue: geminiSpyObj },
        { provide: ResumeProcessingService, useValue: resumeSpyObj }
      ]
    });

    service = TestBed.inject(ScreeningService);
    geminiSpy = TestBed.inject(GeminiApiService) as jasmine.SpyObj<GeminiApiService>;
    resumeSpy = TestBed.inject(ResumeProcessingService) as jasmine.SpyObj<ResumeProcessingService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should rank candidates by score descending', () => {
    const mockResult: ScreeningResult = {
      id: '1',
      jobId: '1',
      resumeAnalyses: [
        { resumeId: '1', score: 85, fileName: 'resume1.pdf', ... },
        { resumeId: '2', score: 92, fileName: 'resume2.pdf', ... },
        { resumeId: '3', score: 78, fileName: 'resume3.pdf', ... }
      ],
      createdAt: new Date(),
      totalResumes: 3,
      processingTime: 5000
    };

    const ranked = service.rankCandidates(mockResult);

    expect(ranked[0].rank).toBe(1);
    expect(ranked[0].score).toBe(92);
    expect(ranked[1].rank).toBe(2);
    expect(ranked[1].score).toBe(85);
    expect(ranked[2].rank).toBe(3);
    expect(ranked[2].score).toBe(78);
  });
});
```

---

## 🚢 Deployment

### Static Hosting (Current MVP)

The application can be deployed to any static hosting platform:

#### **Option 1: Netlify** (Recommended)

1. Build the application:
   ```bash
   npm run build
   ```

2. Create `netlify.toml` in project root:
   ```toml
   [build]
     publish = "dist/ai-resume-screener/browser"
     command = "npm run build"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200

   [build.environment]
     NODE_VERSION = "18"
   ```

3. Deploy:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

4. Set environment variables in Netlify dashboard:
   - `GEMINI_API_KEY`: Your Google Gemini API key

#### **Option 2: Vercel**

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

3. Set environment variables in Vercel dashboard.

#### **Option 3: GitHub Pages**

1. Install gh-pages:
   ```bash
   npm install --save-dev angular-cli-ghpages
   ```

2. Build and deploy:
   ```bash
   ng build --configuration production --base-href=/ai-resume-screener/
   npx angular-cli-ghpages --dir=dist/ai-resume-screener/browser
   ```

#### **Option 4: Firebase Hosting**

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. Initialize:
   ```bash
   firebase init hosting
   ```

3. Deploy:
   ```bash
   npm run build
   firebase deploy
   ```

---

### Docker Deployment

**Dockerfile**:
```dockerfile
# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build --configuration production

# Stage 2: Production
FROM nginx:alpine

# Copy built application
COPY --from=build /app/dist/ai-resume-screener/browser /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf**:
```nginx
events {
  worker_connections 1024;
}

http {
  include /etc/nginx/mime.types;
  default_type application/octet-stream;

  server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Serve static files
    location / {
      try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$ {
      expires 1y;
      add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
  }
}
```

**Build and run**:
```bash
# Build Docker image
docker build -t ai-resume-screener:latest .

# Run container
docker run -p 8080:80 ai-resume-screener:latest

# Access at http://localhost:8080
```

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the [Angular Style Guide](https://angular.io/guide/styleguide)
   - Write tests for new features
   - Update documentation as needed

4. **Run tests and linting**
   ```bash
   ng test
   ng lint  # if configured
   ```

5. **Commit with conventional commits**
   ```bash
   git commit -m "feat: add export to CSV functionality"
   ```

   **Commit types**:
   - `feat`: New feature
   - `fix`: Bug fix
   - `docs`: Documentation changes
   - `style`: Code style changes (formatting, no logic change)
   - `refactor`: Code refactoring
   - `test`: Adding or updating tests
   - `chore`: Maintenance tasks (dependencies, config)

6. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style Guidelines

- **TypeScript**: Use strict mode, avoid `any` types
- **Naming**: Use descriptive names (e.g., `getScoreColor` not `getSC`)
- **Comments**: Add JSDoc comments for public methods
- **Formatting**: Consistent indentation (2 spaces)
- **Imports**: Group and organize imports logically

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 AI Resume Screener

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- **Google Gemini Team** - For the powerful multimodal AI API
- **Mozilla PDF.js Team** - For the robust PDF parsing library
- **PrimeNG Team** - For the excellent Angular UI component library
- **Angular Team** - For the amazing framework and tooling

---

## 📞 Support & Contact

For questions, issues, or feature requests:

- **GitHub Issues**: [Report a bug or request a feature](https://github.com/ahleksu/ai-resume-screener/issues)
- **GitHub Discussions**: [Ask questions or share ideas](https://github.com/ahleksu/ai-resume-screener/discussions)

---

**Built with ❤️ by the AI Resume Screener Team**
