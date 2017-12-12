import { TestBed, inject } from '@angular/core/testing';

import { DiscountEmployeeService } from './discount-employee.service';

describe('DiscountEmployeeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DiscountEmployeeService]
    });
  });

  it('should be created', inject([DiscountEmployeeService], (service: DiscountEmployeeService) => {
    expect(service).toBeTruthy();
  }));
});
