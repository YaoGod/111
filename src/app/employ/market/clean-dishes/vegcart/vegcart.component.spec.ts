import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VegcartComponent } from './vegcart.component';

describe('VegcartComponent', () => {
  let component: VegcartComponent;
  let fixture: ComponentFixture<VegcartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VegcartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VegcartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
