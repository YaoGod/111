import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamineMyComponent } from './examine-my.component';

describe('ExamineMyComponent', () => {
  let component: ExamineMyComponent;
  let fixture: ComponentFixture<ExamineMyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamineMyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamineMyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
