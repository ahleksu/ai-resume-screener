import { TestBed } from '@angular/core/testing';

import { JobDescriptionServiceService } from './job-description-service.service';

describe('JobDescriptionServiceService', () => {
  let service: JobDescriptionServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobDescriptionServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
