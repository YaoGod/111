import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CleanDishesComponent } from './clean-dishes.component';

describe('CleanDishesComponent', () => {
  let component: CleanDishesComponent;
  let fixture: ComponentFixture<CleanDishesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CleanDishesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CleanDishesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
