import { TestBed, inject } from '@angular/core/testing';

import { GlobalUserService } from './global-user.service';

describe('GlobalUserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobalUserService]
    });
  });

  it('should be created', inject([GlobalUserService], (service: GlobalUserService) => {
    expect(service).toBeTruthy();
  }));
});
