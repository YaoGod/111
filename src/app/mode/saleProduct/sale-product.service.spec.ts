import { TestBed, inject } from '@angular/core/testing';

import { SaleProduct } from './sale-product.service';

describe('SaleProduct', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SaleProduct]
    });
  });

  it('should be created', inject([SaleProduct], (service: SaleProduct) => {
    expect(service).toBeTruthy();
  }));
});
