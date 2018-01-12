import { TestBed, inject } from '@angular/core/testing';

import { ConsumeService } from './consume.service';

describe('ConsumeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConsumeService]
    });
  });

  it('should be created', inject([ConsumeService], (service: ConsumeService) => {
    expect(service).toBeTruthy();
  }));
});
