import { TestBed, inject } from '@angular/core/testing';

import { VegetableOrderItem } from './vegetable-order-item.service';

describe('VegetableOrderItemService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VegetableOrderItem]
    });
  });

  it('should be created', inject([VegetableOrderItem], (service: VegetableOrderItem) => {
    expect(service).toBeTruthy();
  }));
});
