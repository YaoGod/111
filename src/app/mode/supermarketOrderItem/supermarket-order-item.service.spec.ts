import { TestBed, inject } from '@angular/core/testing';

import { SupermarketOrderItem } from './supermarket-order-item.service';

describe('SupermarketOrderItemService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SupermarketOrderItem]
    });
  });

  it('should be created', inject([SupermarketOrderItem], (service: SupermarketOrderItem) => {
    expect(service).toBeTruthy();
  }));
});
