import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulletinlistComponent } from './bulletinlist.component';

describe('BulletinlistComponent', () => {
  let component: BulletinlistComponent;
  let fixture: ComponentFixture<BulletinlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulletinlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulletinlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
