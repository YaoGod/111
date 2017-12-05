import { TestBed, inject } from '@angular/core/testing';

import { GroupProduct } from './group-product.service';

describe('GroupProductService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GroupProduct]
    });
  });

  it('should be created', inject([GroupProduct], (service: GroupProduct) => {
    expect(service).toBeTruthy();
  }));
});
