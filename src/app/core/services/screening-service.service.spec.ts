import { TestBed } from '@angular/core/testing';

import { ScreeningServiceService } from './screening-service.service';

describe('ScreeningServiceService', () => {
  let service: ScreeningServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScreeningServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
