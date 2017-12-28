import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupbuyComponent } from './supbuy.component';

describe('SupbuyComponent', () => {
  let component: SupbuyComponent;
  let fixture: ComponentFixture<SupbuyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupbuyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupbuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
