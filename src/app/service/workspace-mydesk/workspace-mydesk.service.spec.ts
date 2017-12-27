import { TestBed, inject } from '@angular/core/testing';

import { WorkspaceMydeskService } from './workspace-mydesk.service';

describe('WorkspaceMydeskService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkspaceMydeskService]
    });
  });

  it('should be created', inject([WorkspaceMydeskService], (service: WorkspaceMydeskService) => {
    expect(service).toBeTruthy();
  }));
});
