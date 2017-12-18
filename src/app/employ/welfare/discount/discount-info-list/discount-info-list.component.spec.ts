import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountInfoListComponent } from './discount-info-list.component';

describe('DiscountInfoListComponent', () => {
  let component: DiscountInfoListComponent;
  let fixture: ComponentFixture<DiscountInfoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscountInfoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountInfoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
