import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoorMangLoggerComponent } from './door-mang-logger.component';

describe('DoorMangLoggerComponent', () => {
  let component: DoorMangLoggerComponent;
  let fixture: ComponentFixture<DoorMangLoggerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoorMangLoggerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoorMangLoggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
