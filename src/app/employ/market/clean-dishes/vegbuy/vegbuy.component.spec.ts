import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VegbuyComponent } from './vegbuy.component';

describe('VegbuyComponent', () => {
  let component: VegbuyComponent;
  let fixture: ComponentFixture<VegbuyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VegbuyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VegbuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
