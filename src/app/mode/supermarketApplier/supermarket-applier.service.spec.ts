import { TestBed, inject } from '@angular/core/testing';

import { SupermarketApplier } from './supermarket-applier.service';

describe('SupermarketApplierService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SupermarketApplier]
    });
  });

  it('should be created', inject([SupermarketApplier], (service: SupermarketApplier) => {
    expect(service).toBeTruthy();
  }));
});
