import { TestBed, inject } from '@angular/core/testing';

import { Welfare } from './welfare.service';

describe('WelfareService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Welfare]
    });
  });

  it('should be created', inject([Welfare], (service: Welfare) => {
    expect(service).toBeTruthy();
  }));
});
