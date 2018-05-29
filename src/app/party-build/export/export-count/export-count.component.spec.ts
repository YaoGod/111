import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportCountComponent } from './export-count.component';

describe('ExportCountComponent', () => {
  let component: ExportCountComponent;
  let fixture: ComponentFixture<ExportCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
