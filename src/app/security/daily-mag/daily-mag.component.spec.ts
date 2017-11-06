import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyMagComponent } from './daily-mag.component';

describe('DailyMagComponent', () => {
  let component: DailyMagComponent;
  let fixture: ComponentFixture<DailyMagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyMagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyMagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
