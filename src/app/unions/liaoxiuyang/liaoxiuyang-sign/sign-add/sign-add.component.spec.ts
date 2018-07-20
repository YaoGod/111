import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignAddComponent } from './sign-add.component';

describe('SignAddComponent', () => {
  let component: SignAddComponent;
  let fixture: ComponentFixture<SignAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
