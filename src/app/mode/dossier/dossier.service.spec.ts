import { TestBed, inject } from '@angular/core/testing';

import { Dossier } from './dossier.service';

describe('Dossier', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Dossier]
    });
  });

  it('should be created', inject([Dossier], (service: Dossier) => {
    expect(service).toBeTruthy();
  }));
});
