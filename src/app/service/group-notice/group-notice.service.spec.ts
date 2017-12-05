import { TestBed, inject } from '@angular/core/testing';

import { GroupNoticeService } from './group-notice.service';

describe('GroupNoticeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GroupNoticeService]
    });
  });

  it('should be created', inject([GroupNoticeService], (service: GroupNoticeService) => {
    expect(service).toBeTruthy();
  }));
});
