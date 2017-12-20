import { TestBed, inject } from '@angular/core/testing';

import { VegetableInfoService } from './vegetable-info.service';

describe('VegetableInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VegetableInfoService]
    });
  });

  it('should be created', inject([VegetableInfoService], (service: VegetableInfoService) => {
    expect(service).toBeTruthy();
  }));
});
