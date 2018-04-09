import { TestBed, inject } from '@angular/core/testing';

import { PublicresourceVoteService } from './publicresource-vote.service';

describe('PublicresourceVoteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PublicresourceVoteService]
    });
  });

  it('should be created', inject([PublicresourceVoteService], (service: PublicresourceVoteService) => {
    expect(service).toBeTruthy();
  }));
});
