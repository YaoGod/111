import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteStatisticsComponent } from './vote-statistics.component';

describe('VoteStatisticsComponent', () => {
  let component: VoteStatisticsComponent;
  let fixture: ComponentFixture<VoteStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoteStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoteStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
