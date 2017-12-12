import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffWelfareMangComponent } from './staff-welfare-mang.component';

describe('StaffWelfareMangComponent', () => {
  let component: StaffWelfareMangComponent;
  let fixture: ComponentFixture<StaffWelfareMangComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffWelfareMangComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffWelfareMangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
