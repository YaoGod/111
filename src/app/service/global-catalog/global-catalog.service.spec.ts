import { TestBed, inject } from '@angular/core/testing';

import { GlobalCatalogService } from './global-catalog.service';

describe('GlobalCatalogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobalCatalogService]
    });
  });

  it('should be created', inject([GlobalCatalogService], (service: GlobalCatalogService) => {
    expect(service).toBeTruthy();
  }));
});
