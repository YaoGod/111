import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiaoxiuyangGroupComponent } from './liaoxiuyang-group.component';

describe('LiaoxiuyangGroupComponent', () => {
  let component: LiaoxiuyangGroupComponent;
  let fixture: ComponentFixture<LiaoxiuyangGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiaoxiuyangGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiaoxiuyangGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
