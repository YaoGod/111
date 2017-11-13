import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgBasicComponent } from './msg-basic.component';

describe('MsgBasicComponent', () => {
  let component: MsgBasicComponent;
  let fixture: ComponentFixture<MsgBasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsgBasicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsgBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
