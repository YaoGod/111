import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalReportComponent } from './proposal-report.component';

describe('ProposalReportComponent', () => {
  let component: ProposalReportComponent;
  let fixture: ComponentFixture<ProposalReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposalReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
