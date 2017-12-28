import { TestBed, inject } from '@angular/core/testing';

import { SupermarketOrder } from './supermarket-order.service';

describe('SupermarketOrderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SupermarketOrder]
    });
  });

  it('should be created', inject([SupermarketOrder], (service: SupermarketOrder) => {
    expect(service).toBeTruthy();
  }));
});
