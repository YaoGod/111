import { TestBed, inject } from '@angular/core/testing';

import { Floor } from './floor.service';

describe('FloorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Floor]
    });
  });

  it('should be created', inject([Floor], (service: Floor) => {
    expect(service).toBeTruthy();
  }));
});
