import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamineDetailComponent } from './examine-detail.component';

describe('ExamineDetailComponent', () => {
  let component: ExamineDetailComponent;
  let fixture: ComponentFixture<ExamineDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamineDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamineDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
