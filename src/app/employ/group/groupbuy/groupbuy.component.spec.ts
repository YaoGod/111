import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupbuyComponent } from './groupbuy.component';

describe('GroupbuyComponent', () => {
  let component: GroupbuyComponent;
  let fixture: ComponentFixture<GroupbuyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupbuyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupbuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
