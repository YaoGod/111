import { TestBed, inject } from '@angular/core/testing';

import { GroupOrderItem } from './group-orderItem.service';

describe('GroupOrderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GroupOrderItem]
    });
  });

  it('should be created', inject([GroupOrderItem], (service: GroupOrderItem) => {
    expect(service).toBeTruthy();
  }));
});
