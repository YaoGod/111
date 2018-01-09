import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VegetableCountComponent } from './vegetable-count.component';

describe('VegetableCountComponent', () => {
  let component: VegetableCountComponent;
  let fixture: ComponentFixture<VegetableCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VegetableCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VegetableCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
