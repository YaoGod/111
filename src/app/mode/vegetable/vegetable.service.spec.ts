import { TestBed, inject } from '@angular/core/testing';

import { Vegetable } from './vegetable.service';

describe('Vegetable', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Vegetable]
    });
  });

  it('should be created', inject([Vegetable], (service: Vegetable) => {
    expect(service).toBeTruthy();
  }));
});
