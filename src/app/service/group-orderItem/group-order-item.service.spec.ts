import { TestBed, inject } from '@angular/core/testing';

import { GroupOrderItemService } from './group-order-item.service';

describe('GroupOrderItemService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GroupOrderItemService]
    });
  });

  it('should be created', inject([GroupOrderItemService], (service: GroupOrderItemService) => {
    expect(service).toBeTruthy();
  }));
});
