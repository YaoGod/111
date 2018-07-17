import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiaoxiuyangConditionComponent } from './liaoxiuyang-condition.component';

describe('LiaoxiuyangConditionComponent', () => {
  let component: LiaoxiuyangConditionComponent;
  let fixture: ComponentFixture<LiaoxiuyangConditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiaoxiuyangConditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiaoxiuyangConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
