import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiaoxiuyangBatchDetailComponent } from './liaoxiuyang-batch-detail.component';

describe('LiaoxiuyangBatchDetailComponent', () => {
  let component: LiaoxiuyangBatchDetailComponent;
  let fixture: ComponentFixture<LiaoxiuyangBatchDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiaoxiuyangBatchDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiaoxiuyangBatchDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
