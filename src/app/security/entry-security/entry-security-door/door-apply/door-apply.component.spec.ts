import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoorApplyComponent } from './door-apply.component';

describe('DoorApplyComponent', () => {
  let component: DoorApplyComponent;
  let fixture: ComponentFixture<DoorApplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoorApplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoorApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
