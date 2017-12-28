import { TestBed, inject } from '@angular/core/testing';

import { SupermarketManagerService } from './supermarket-manager.service';

describe('SupermarketManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SupermarketManagerService]
    });
  });

  it('should be created', inject([SupermarketManagerService], (service: SupermarketManagerService) => {
    expect(service).toBeTruthy();
  }));
});
