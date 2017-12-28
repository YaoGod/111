import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmsupcartComponent } from './confirmsupcart.component';

describe('ConfirmsupcartComponent', () => {
  let component: ConfirmsupcartComponent;
  let fixture: ComponentFixture<ConfirmsupcartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmsupcartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmsupcartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
