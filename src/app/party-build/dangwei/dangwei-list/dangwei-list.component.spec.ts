import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DangweiListComponent } from './dangwei-list.component';

describe('DangweiListComponent', () => {
  let component: DangweiListComponent;
  let fixture: ComponentFixture<DangweiListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DangweiListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DangweiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
