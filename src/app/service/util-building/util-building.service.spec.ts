import { TestBed, inject } from '@angular/core/testing';

import { UtilBuildingService } from './util-building.service';

describe('UtilBuildingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UtilBuildingService]
    });
  });

  it('should be created', inject([UtilBuildingService], (service: UtilBuildingService) => {
    expect(service).toBeTruthy();
  }));
});
