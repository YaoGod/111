import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CongflowDetailComponent } from './congflow-detail.component';

describe('CongflowDetailComponent', () => {
  let component: CongflowDetailComponent;
  let fixture: ComponentFixture<CongflowDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CongflowDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CongflowDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
