import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffWelfareDetailComponent } from './staff-welfare-detail.component';

describe('StaffWelfareDetailComponent', () => {
  let component: StaffWelfareDetailComponent;
  let fixture: ComponentFixture<StaffWelfareDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffWelfareDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffWelfareDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
