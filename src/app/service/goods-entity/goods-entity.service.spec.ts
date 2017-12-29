import { TestBed, inject } from '@angular/core/testing';

import { GoodsEntityService } from './goods-entity.service';

describe('GoodsEntityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoodsEntityService]
    });
  });

  it('should be created', inject([GoodsEntityService], (service: GoodsEntityService) => {
    expect(service).toBeTruthy();
  }));
});
