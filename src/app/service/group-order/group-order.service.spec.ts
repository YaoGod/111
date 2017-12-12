import { TestBed, inject } from '@angular/core/testing';

import { GroupOrderService } from './group-order.service';

describe('GroupOrderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GroupOrderService]
    });
  });

  it('should be created', inject([GroupOrderService], (service: GroupOrderService) => {
    expect(service).toBeTruthy();
  }));
});
