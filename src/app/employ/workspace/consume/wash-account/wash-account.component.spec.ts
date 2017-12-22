import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WashAccountComponent } from './wash-account.component';

describe('WashAccountComponent', () => {
  let component: WashAccountComponent;
  let fixture: ComponentFixture<WashAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WashAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WashAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
