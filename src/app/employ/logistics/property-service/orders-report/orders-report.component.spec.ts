import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersReportyComponent } from './orders-report.component';

describe('OrdersReportyComponent', () => {
  let component: OrdersReportyComponent;
  let fixture: ComponentFixture<OrdersReportyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersReportyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersReportyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
