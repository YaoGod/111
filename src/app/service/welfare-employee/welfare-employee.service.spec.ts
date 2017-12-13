import { TestBed, inject } from '@angular/core/testing';

import { WelfareEmployeeService } from './welfare-employee.service';

describe('WelfareEmployeeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WelfareEmployeeService]
    });
  });

  it('should be created', inject([WelfareEmployeeService], (service: WelfareEmployeeService) => {
    expect(service).toBeTruthy();
  }));
});
