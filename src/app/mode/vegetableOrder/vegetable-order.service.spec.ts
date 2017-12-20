import { TestBed, inject } from '@angular/core/testing';

import { VegetableOrder } from './vegetable-order.service';

describe('VegetableOrderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VegetableOrder]
    });
  });

  it('should be created', inject([VegetableOrder], (service: VegetableOrder) => {
    expect(service).toBeTruthy();
  }));
});
