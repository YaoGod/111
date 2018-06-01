import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DangweiComponent } from './dangwei.component';

describe('DangweiComponent', () => {
  let component: DangweiComponent;
  let fixture: ComponentFixture<DangweiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DangweiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DangweiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
