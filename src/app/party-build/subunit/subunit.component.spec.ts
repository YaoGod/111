import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubunitComponent } from './subunit.component';

describe('SubunitComponent', () => {
  let component: SubunitComponent;
  let fixture: ComponentFixture<SubunitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubunitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubunitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
