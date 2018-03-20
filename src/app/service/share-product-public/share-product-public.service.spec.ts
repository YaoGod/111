import { TestBed, inject } from '@angular/core/testing';

import { ShareProductPublicService } from './share-product-public.service';

describe('ShareProductPublicService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShareProductPublicService]
    });
  });

  it('should be created', inject([ShareProductPublicService], (service: ShareProductPublicService) => {
    expect(service).toBeTruthy();
  }));
});
