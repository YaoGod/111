import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountInfoDetailComponent } from './discount-info-detail.component';

describe('DiscountInfoDetailComponent', () => {
  let component: DiscountInfoDetailComponent;
  let fixture: ComponentFixture<DiscountInfoDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscountInfoDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountInfoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
