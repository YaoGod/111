import { TestBed, inject } from '@angular/core/testing';

import { RepairBuildingService } from './repair-building.service';

describe('RepairBuildingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RepairBuildingService]
    });
  });

  it('should be created', inject([RepairBuildingService], (service: RepairBuildingService) => {
    expect(service).toBeTruthy();
  }));
});
