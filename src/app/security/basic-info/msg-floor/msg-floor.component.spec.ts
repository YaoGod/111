import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgFloorComponent } from './msg-floor.component';

describe('MsgFloorComponent', () => {
  let component: MsgFloorComponent;
  let fixture: ComponentFixture<MsgFloorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsgFloorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsgFloorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
