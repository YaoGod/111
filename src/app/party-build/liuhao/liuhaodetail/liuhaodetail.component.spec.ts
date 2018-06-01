import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiuhaodetailComponent } from './liuhaodetail.component';

describe('LiuhaodetailComponent', () => {
  let component: LiuhaodetailComponent;
  let fixture: ComponentFixture<LiuhaodetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiuhaodetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiuhaodetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
