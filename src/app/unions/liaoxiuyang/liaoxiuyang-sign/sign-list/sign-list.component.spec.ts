import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignListComponent } from './sign-list.component';

describe('SignListComponent', () => {
  let component: SignListComponent;
  let fixture: ComponentFixture<SignListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
