import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityBulletinComponent } from './activity-bulletin.component';

describe('ActivityBulletinComponent', () => {
  let component: ActivityBulletinComponent;
  let fixture: ComponentFixture<ActivityBulletinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityBulletinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityBulletinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
