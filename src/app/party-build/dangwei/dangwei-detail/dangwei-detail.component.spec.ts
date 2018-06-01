import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DangweiDetailComponent } from './dangwei-detail.component';

describe('DangweiDetailComponent', () => {
  let component: DangweiDetailComponent;
  let fixture: ComponentFixture<DangweiDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DangweiDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DangweiDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
