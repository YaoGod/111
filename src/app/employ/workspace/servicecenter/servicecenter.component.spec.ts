import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicecenterComponent } from './servicecenter.component';

describe('ServicecenterComponent', () => {
  let component: ServicecenterComponent;
  let fixture: ComponentFixture<ServicecenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicecenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicecenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
