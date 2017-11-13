import { TestBed, inject } from '@angular/core/testing';

import { Catalog } from './catalog.service';

describe('CatalogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Catalog]
    });
  });

  it('should be created', inject([Catalog], (service: Catalog) => {
    expect(service).toBeTruthy();
  }));
});
