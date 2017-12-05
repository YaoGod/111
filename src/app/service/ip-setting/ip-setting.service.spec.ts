import { TestBed, inject } from '@angular/core/testing';

import { IpSettingService } from './ip-setting.service';

describe('IpSettingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IpSettingService]
    });
  });

  it('should be created', inject([IpSettingService], (service: IpSettingService) => {
    expect(service).toBeTruthy();
  }));
});
