import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaundryAdminComponent } from './laundry-admin.component';

describe('LaundryAdminComponent', () => {
  let component: LaundryAdminComponent;
  let fixture: ComponentFixture<LaundryAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaundryAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaundryAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
