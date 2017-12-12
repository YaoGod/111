import { TestBed, inject } from '@angular/core/testing';

import { GroupOrder } from './group-order.service';

describe('GroupOrderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GroupOrder]
    });
  });

  it('should be created', inject([GroupOrder], (service: GroupOrder) => {
    expect(service).toBeTruthy();
  }));
});
