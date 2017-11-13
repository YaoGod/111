import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgBelongComponent } from './msg-belong.component';

describe('MsgBelongComponent', () => {
  let component: MsgBelongComponent;
  let fixture: ComponentFixture<MsgBelongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsgBelongComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsgBelongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
