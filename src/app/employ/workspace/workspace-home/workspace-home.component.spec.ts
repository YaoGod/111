import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceHomeComponent } from './workspace-home.component';

describe('WorkspaceHomeComponent', () => {
  let component: WorkspaceHomeComponent;
  let fixture: ComponentFixture<WorkspaceHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkspaceHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
