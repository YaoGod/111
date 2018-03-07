import { TestBed, inject } from '@angular/core/testing';

import { SaleProductEmployeeService } from './sale-product-employee.service';

describe('SaleProductEmployeeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SaleProductEmployeeService]
    });
  });

  it('should be created', inject([SaleProductEmployeeService], (service: SaleProductEmployeeService) => {
    expect(service).toBeTruthy();
  }));
});
