import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleMyorderComponent } from './sale-myorder.component';

describe('SaleMyorderComponent', () => {
  let component: SaleMyorderComponent;
  let fixture: ComponentFixture<SaleMyorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleMyorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleMyorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
