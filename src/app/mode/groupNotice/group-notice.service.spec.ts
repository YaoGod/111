import { TestBed, inject } from '@angular/core/testing';

import { GroupNotice } from './group-notice.service';

describe('GroupNoticeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GroupNotice]
    });
  });

  it('should be created', inject([GroupNotice], (service: GroupNotice) => {
    expect(service).toBeTruthy();
  }));
});
