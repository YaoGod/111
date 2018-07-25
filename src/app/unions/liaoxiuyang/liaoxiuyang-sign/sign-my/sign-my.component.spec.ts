import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignMyComponent } from './sign-my.component';

describe('SignMyComponent', () => {
  let component: SignMyComponent;
  let fixture: ComponentFixture<SignMyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignMyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignMyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
