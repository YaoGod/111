import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobMangComponent } from './job-mang.component';

describe('JobMangComponent', () => {
  let component: JobMangComponent;
  let fixture: ComponentFixture<JobMangComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobMangComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobMangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
