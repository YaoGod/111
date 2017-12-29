import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsbuyComponent } from './goodsbuy.component';

describe('GoodsbuyComponent', () => {
  let component: GoodsbuyComponent;
  let fixture: ComponentFixture<GoodsbuyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsbuyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsbuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
