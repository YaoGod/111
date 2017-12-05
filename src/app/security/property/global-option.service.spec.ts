import { TestBed, inject } from '@angular/core/testing';

import { GlobalOptionService } from './global-option.service';

describe('GlobalOptionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobalOptionService]
    });
  });

  it('should be created', inject([GlobalOptionService], (service: GlobalOptionService) => {
    expect(service).toBeTruthy();
  }));
});
