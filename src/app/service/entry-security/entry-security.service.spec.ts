import { TestBed, inject } from '@angular/core/testing';

import { EntrySecurityService } from './entry-security.service';

describe('EntrySecurityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EntrySecurityService]
    });
  });

  it('should be created', inject([EntrySecurityService], (service: EntrySecurityService) => {
    expect(service).toBeTruthy();
  }));
});
