import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsAccountComponent } from './cons-account.component';

describe('ConsAccountComponent', () => {
  let component: ConsAccountComponent;
  let fixture: ComponentFixture<ConsAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
