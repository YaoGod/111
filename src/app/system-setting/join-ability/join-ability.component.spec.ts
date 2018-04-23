import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinAbilityComponent } from './join-ability.component';

describe('JoinAbilityComponent', () => {
  let component: JoinAbilityComponent;
  let fixture: ComponentFixture<JoinAbilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinAbilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinAbilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
