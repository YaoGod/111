import { TestBed, inject } from '@angular/core/testing';

import { DossierBuildingService } from './dossier-building.service';

describe('DossierBuildingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DossierBuildingService]
    });
  });

  it('should be created', inject([DossierBuildingService], (service: DossierBuildingService) => {
    expect(service).toBeTruthy();
  }));
});
