import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyServiceComponent } from './property-service.component';

describe('PropertyServiceComponent', () => {
  let component: PropertyServiceComponent;
  let fixture: ComponentFixture<PropertyServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
