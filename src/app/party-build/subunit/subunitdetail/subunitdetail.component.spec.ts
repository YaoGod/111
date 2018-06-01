import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubunitdetailComponent } from './subunitdetail.component';

describe('SubunitdetailComponent', () => {
  let component: SubunitdetailComponent;
  let fixture: ComponentFixture<SubunitdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubunitdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubunitdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
