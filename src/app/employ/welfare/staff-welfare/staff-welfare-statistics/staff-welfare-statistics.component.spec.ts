import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffWelfareStatisticsComponent } from './staff-welfare-statistics.component';

describe('StaffWelfareStatisticsComponent', () => {
  let component: StaffWelfareStatisticsComponent;
  let fixture: ComponentFixture<StaffWelfareStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffWelfareStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffWelfareStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
