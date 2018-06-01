import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiuhaolistComponent } from './liuhaolist.component';

describe('LiuhaolistComponent', () => {
  let component: LiuhaolistComponent;
  let fixture: ComponentFixture<LiuhaolistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiuhaolistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiuhaolistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
