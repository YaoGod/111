import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffWelfareSearchComponent } from './staff-welfare-search.component';

describe('StaffWelfareSearchComponent', () => {
  let component: StaffWelfareSearchComponent;
  let fixture: ComponentFixture<StaffWelfareSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffWelfareSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffWelfareSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
