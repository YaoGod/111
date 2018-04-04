import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteMangComponent } from './vote-mang.component';

describe('VoteMangComponent', () => {
  let component: VoteMangComponent;
  let fixture: ComponentFixture<VoteMangComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoteMangComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoteMangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
