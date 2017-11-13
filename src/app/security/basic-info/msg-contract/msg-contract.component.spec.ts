import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgContractComponent } from './msg-contract.component';

describe('MsgContractComponent', () => {
  let component: MsgContractComponent;
  let fixture: ComponentFixture<MsgContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsgContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsgContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
