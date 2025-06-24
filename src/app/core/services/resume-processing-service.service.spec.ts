import { TestBed } from '@angular/core/testing';

import { ResumeProcessingServiceService } from './resume-processing-service.service';

describe('ResumeProcessingServiceService', () => {
  let service: ResumeProcessingServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResumeProcessingServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
