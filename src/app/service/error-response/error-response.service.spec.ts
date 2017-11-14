import { TestBed, inject } from '@angular/core/testing';

import { ErrorResponseService } from './error-response.service';

describe('ErrorResponseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorResponseService]
    });
  });

  it('should be created', inject([ErrorResponseService], (service: ErrorResponseService) => {
    expect(service).toBeTruthy();
  }));
});
