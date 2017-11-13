import { TestBed, inject } from '@angular/core/testing';

import { Building } from './building.service';

describe('BuildingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Building]
    });
  });

  it('should be created', inject([Building], (service: Building) => {
    expect(service).toBeTruthy();
  }));
});
