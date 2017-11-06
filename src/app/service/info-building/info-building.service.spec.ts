import { TestBed, inject } from '@angular/core/testing';

import { InfoBuildingService } from './info-building.service';

describe('InfoBuildingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InfoBuildingService]
    });
  });

  it('should be created', inject([InfoBuildingService], (service: InfoBuildingService) => {
    expect(service).toBeTruthy();
  }));
});
