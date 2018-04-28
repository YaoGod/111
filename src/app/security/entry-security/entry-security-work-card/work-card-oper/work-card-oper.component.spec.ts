import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkCardOperComponent } from './work-card-oper.component';

describe('WorkCardOperComponent', () => {
  let component: WorkCardOperComponent;
  let fixture: ComponentFixture<WorkCardOperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkCardOperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkCardOperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
