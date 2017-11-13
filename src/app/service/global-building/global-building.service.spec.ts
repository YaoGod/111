import { TestBed, inject } from '@angular/core/testing';

import { GlobalBuildingService } from './global-building.service';

describe('GlobalBuildingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobalBuildingService]
    });
  });

  it('should be created', inject([GlobalBuildingService], (service: GlobalBuildingService) => {
    expect(service).toBeTruthy();
  }));
});
