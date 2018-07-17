import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiaoxiuyangSignComponent } from './liaoxiuyang-sign.component';

describe('LiaoxiuyangSignComponent', () => {
  let component: LiaoxiuyangSignComponent;
  let fixture: ComponentFixture<LiaoxiuyangSignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiaoxiuyangSignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiaoxiuyangSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
