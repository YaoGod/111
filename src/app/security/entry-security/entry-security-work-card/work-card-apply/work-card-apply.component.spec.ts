import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkCardApplyComponent } from './work-card-apply.component';

describe('WorkCardApplyComponent', () => {
  let component: WorkCardApplyComponent;
  let fixture: ComponentFixture<WorkCardApplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkCardApplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkCardApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
