import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiaoxiuyangBatchComponent } from './liaoxiuyang-batch.component';

describe('LiaoxiuyangBatchComponent', () => {
  let component: LiaoxiuyangBatchComponent;
  let fixture: ComponentFixture<LiaoxiuyangBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiaoxiuyangBatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiaoxiuyangBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
