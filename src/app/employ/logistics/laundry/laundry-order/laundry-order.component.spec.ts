import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaundryOrderComponent } from './laundry-order.component';

describe('LaundryOrderComponent', () => {
  let component: LaundryOrderComponent;
  let fixture: ComponentFixture<LaundryOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaundryOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaundryOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
