import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffWelfareComponent } from './staff-welfare.component';

describe('StaffWelfareComponent', () => {
  let component: StaffWelfareComponent;
  let fixture: ComponentFixture<StaffWelfareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffWelfareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffWelfareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
