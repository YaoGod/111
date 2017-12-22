import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupermarketComponent } from './supermarket.component';

describe('SupermarketComponent', () => {
  let component: SupermarketComponent;
  let fixture: ComponentFixture<SupermarketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupermarketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupermarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
