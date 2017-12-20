import { TestBed, inject } from '@angular/core/testing';

import { User } from './user.service';

describe('UserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [User]
    });
  });

  it('should be created', inject([User], (service: User) => {
    expect(service).toBeTruthy();
  }));
});
