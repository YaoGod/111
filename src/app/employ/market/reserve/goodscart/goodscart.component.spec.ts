import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodscartComponent } from './goodscart.component';

describe('GoodscartComponent', () => {
  let component: GoodscartComponent;
  let fixture: ComponentFixture<GoodscartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodscartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodscartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
