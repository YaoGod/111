import { TestBed, inject } from '@angular/core/testing';

import { Contract } from './contract.service';

describe('Contract', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Contract]
    });
  });

  it('should be created', inject([Contract], (service: Contract) => {
    expect(service).toBeTruthy();
  }));
});
