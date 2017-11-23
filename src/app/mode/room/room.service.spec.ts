import { TestBed, inject } from '@angular/core/testing';

import { Room } from './room.service';

describe('RoomService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Room]
    });
  });

  it('should be created', inject([Room], (service: Room) => {
    expect(service).toBeTruthy();
  }));
});
