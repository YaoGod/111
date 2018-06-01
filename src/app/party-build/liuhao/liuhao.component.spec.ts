import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiuhaoComponent } from './liuhao.component';

describe('LiuhaoComponent', () => {
  let component: LiuhaoComponent;
  let fixture: ComponentFixture<LiuhaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiuhaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiuhaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
