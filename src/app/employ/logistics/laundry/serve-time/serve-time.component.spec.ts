import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServeTimeComponent } from './serve-time.component';

describe('ServeTimeComponent', () => {
  let component: ServeTimeComponent;
  let fixture: ComponentFixture<ServeTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServeTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServeTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
