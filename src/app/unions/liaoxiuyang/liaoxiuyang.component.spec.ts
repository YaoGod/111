import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiaoxiuyangComponent } from './liaoxiuyang.component';

describe('LiaoxiuyangComponent', () => {
  let component: LiaoxiuyangComponent;
  let fixture: ComponentFixture<LiaoxiuyangComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiaoxiuyangComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiaoxiuyangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
