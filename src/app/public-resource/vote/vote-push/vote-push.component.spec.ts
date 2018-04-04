import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VotePushComponent } from './vote-push.component';

describe('VotePushComponent', () => {
  let component: VotePushComponent;
  let fixture: ComponentFixture<VotePushComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VotePushComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VotePushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
