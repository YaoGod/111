import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiaoxiuyangApproveComponent } from './liaoxiuyang-approve.component';

describe('LiaoxiuyangApproveComponent', () => {
  let component: LiaoxiuyangApproveComponent;
  let fixture: ComponentFixture<LiaoxiuyangApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiaoxiuyangApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiaoxiuyangApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
