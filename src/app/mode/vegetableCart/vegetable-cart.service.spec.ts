import { TestBed, inject } from '@angular/core/testing';

import { VegetableCart} from './vegetable-cart.service';

describe('VegetableCart', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VegetableCart]
    });
  });

  it('should be created', inject([VegetableCart], (service: VegetableCart) => {
    expect(service).toBeTruthy();
  }));
});
