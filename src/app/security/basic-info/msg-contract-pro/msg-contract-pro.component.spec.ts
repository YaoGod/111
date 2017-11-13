import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgContractProComponent } from './msg-contract-pro.component';

describe('MsgContractProComponent', () => {
  let component: MsgContractProComponent;
  let fixture: ComponentFixture<MsgContractProComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsgContractProComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsgContractProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
