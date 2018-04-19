import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinRoleComponent } from './join-role.component';

describe('JoinRoleComponent', () => {
  let component: JoinRoleComponent;
  let fixture: ComponentFixture<JoinRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
