import { TestBed, inject } from '@angular/core/testing';

import { Discount } from './discount.service';

describe('DiscountService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Discount]
    });
  });

  it('should be created', inject([Discount], (service: Discount) => {
    expect(service).toBeTruthy();
  }));
});
