import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiaoxiuyangLineComponent } from './liaoxiuyang-line.component';

describe('LiaoxiuyangLineComponent', () => {
  let component: LiaoxiuyangLineComponent;
  let fixture: ComponentFixture<LiaoxiuyangLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiaoxiuyangLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiaoxiuyangLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
