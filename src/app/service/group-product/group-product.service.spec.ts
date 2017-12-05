import { TestBed, inject } from '@angular/core/testing';

import { GroupProductService } from './group-product.service';

describe('GroupProductService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GroupProductService]
    });
  });

  it('should be created', inject([GroupProductService], (service: GroupProductService) => {
    expect(service).toBeTruthy();
  }));
});
