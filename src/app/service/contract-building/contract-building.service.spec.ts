import { TestBed, inject } from '@angular/core/testing';

import { ContractBuildingService } from './contract-building.service';

describe('ContractBuildingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContractBuildingService]
    });
  });

  it('should be created', inject([ContractBuildingService], (service: ContractBuildingService) => {
    expect(service).toBeTruthy();
  }));
});
