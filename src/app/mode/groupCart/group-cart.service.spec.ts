import { TestBed, inject } from '@angular/core/testing';

import { GroupCart } from './group-cart.service';

describe('GroupCartService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GroupCart]
    });
  });

  it('should be created', inject([GroupCart], (service: GroupCart) => {
    expect(service).toBeTruthy();
  }));
});
