import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResubmitComponent } from './resubmit.component';

describe('ResubmitComponent', () => {
  let component: ResubmitComponent;
  let fixture: ComponentFixture<ResubmitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResubmitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
