import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedetailComponent } from './featuredetail.component';

describe('FeaturedetailComponent', () => {
  let component: FeaturedetailComponent;
  let fixture: ComponentFixture<FeaturedetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeaturedetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturedetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
