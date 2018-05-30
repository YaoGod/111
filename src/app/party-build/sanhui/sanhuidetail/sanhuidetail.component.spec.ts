import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SanhuidetailComponent } from './sanhuidetail.component';

describe('SanhuidetailComponent', () => {
  let component: SanhuidetailComponent;
  let fixture: ComponentFixture<SanhuidetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SanhuidetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SanhuidetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
