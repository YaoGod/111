import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubunitlistComponent } from './subunitlist.component';

describe('SubunitlistComponent', () => {
  let component: SubunitlistComponent;
  let fixture: ComponentFixture<SubunitlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubunitlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubunitlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
