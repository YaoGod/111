import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanLaundryComponent } from './plan-laundry.component';

describe('PlanLaundryComponent', () => {
  let component: PlanLaundryComponent;
  let fixture: ComponentFixture<PlanLaundryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanLaundryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanLaundryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
