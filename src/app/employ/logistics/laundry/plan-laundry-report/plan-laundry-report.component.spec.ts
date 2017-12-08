import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanLaundryReportyComponent } from './plan-laundry-report.component';

describe('PlanLaundryReportyComponent', () => {
  let component: PlanLaundryReportyComponent;
  let fixture: ComponentFixture<PlanLaundryReportyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanLaundryReportyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanLaundryReportyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
