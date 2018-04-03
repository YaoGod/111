import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoorMangComponent } from './door-mang.component';

describe('DoorMangComponent', () => {
  let component: DoorMangComponent;
  let fixture: ComponentFixture<DoorMangComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoorMangComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoorMangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
