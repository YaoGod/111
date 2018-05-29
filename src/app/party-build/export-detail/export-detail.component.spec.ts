import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportDetailComponent } from './export-detail.component';

describe('ExportDetailComponent', () => {
  let component: ExportDetailComponent;
  let fixture: ComponentFixture<ExportDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
