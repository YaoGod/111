import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VegorderComponent } from './vegorder.component';

describe('VegorderComponent', () => {
  let component: VegorderComponent;
  let fixture: ComponentFixture<VegorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VegorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VegorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
