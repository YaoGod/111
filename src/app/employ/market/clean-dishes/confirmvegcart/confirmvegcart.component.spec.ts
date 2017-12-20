import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmvegcartComponent } from './confirmvegcart.component';

describe('ConfirmvegcartComponent', () => {
  let component: ConfirmvegcartComponent;
  let fixture: ComponentFixture<ConfirmvegcartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmvegcartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmvegcartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
