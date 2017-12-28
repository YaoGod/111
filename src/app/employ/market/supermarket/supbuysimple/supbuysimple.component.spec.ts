import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupbuysimpleComponent } from './supbuysimple.component';

describe('SupbuysimpleComponent', () => {
  let component: SupbuysimpleComponent;
  let fixture: ComponentFixture<SupbuysimpleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupbuysimpleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupbuysimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
