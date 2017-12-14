import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderhandComponent } from './orderhand.component';

describe('OrderhandComponent', () => {
  let component: OrderhandComponent;
  let fixture: ComponentFixture<OrderhandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderhandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderhandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
