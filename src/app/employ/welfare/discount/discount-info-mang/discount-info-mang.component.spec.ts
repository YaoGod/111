import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountInfoMangComponent } from './discount-info-mang.component';

describe('DiscountInfoMangComponent', () => {
  let component: DiscountInfoMangComponent;
  let fixture: ComponentFixture<DiscountInfoMangComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscountInfoMangComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountInfoMangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
