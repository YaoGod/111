import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuporderComponent } from './supermarketOrder.component';

describe('SuporderComponent', () => {
  let component: SuporderComponent;
  let fixture: ComponentFixture<SuporderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuporderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuporderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
