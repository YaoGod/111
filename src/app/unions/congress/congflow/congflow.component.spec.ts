import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CongflowComponent } from './congflow.component';

describe('CongflowComponent', () => {
  let component: CongflowComponent;
  let fixture: ComponentFixture<CongflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CongflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CongflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
