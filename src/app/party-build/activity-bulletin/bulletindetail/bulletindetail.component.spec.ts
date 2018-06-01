import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulletindetailComponent } from './bulletindetail.component';

describe('BulletindetailComponent', () => {
  let component: BulletindetailComponent;
  let fixture: ComponentFixture<BulletindetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulletindetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulletindetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
