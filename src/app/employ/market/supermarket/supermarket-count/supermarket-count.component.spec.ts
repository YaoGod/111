import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupermarketCountComponent } from './supermarket-count.component';

describe('SupermarketCountComponent', () => {
  let component: SupermarketCountComponent;
  let fixture: ComponentFixture<SupermarketCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupermarketCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupermarketCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
