import { TestBed, inject } from '@angular/core/testing';

import { TypeDefine } from './type-define.service';

describe('TypeDefineService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TypeDefine]
    });
  });

  it('should be created', inject([TypeDefine], (service: TypeDefine) => {
    expect(service).toBeTruthy();
  }));
});
