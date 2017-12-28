import { TestBed, inject } from '@angular/core/testing';

import { SupermarketCart } from './supermarket-cart.service';

describe('SupermarketCartService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SupermarketCart]
    });
  });

  it('should be created', inject([SupermarketCart], (service: SupermarketCart) => {
    expect(service).toBeTruthy();
  }));
});
