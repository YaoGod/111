import { TestBed, inject } from '@angular/core/testing';

import { SupermarketProduct } from './supermarket-product.service';

describe('SupermarketProductService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SupermarketProduct]
    });
  });

  it('should be created', inject([SupermarketProduct], (service: SupermarketProduct) => {
    expect(service).toBeTruthy();
  }));
});
