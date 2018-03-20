import { TestBed, inject } from '@angular/core/testing';

import { ShareProduct } from './share-product.service';

describe('ShareProductService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShareProduct]
    });
  });

  it('should be created', inject([ShareProduct], (service: ShareProduct) => {
    expect(service).toBeTruthy();
  }));
});
