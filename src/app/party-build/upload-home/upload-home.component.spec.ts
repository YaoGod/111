import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadHomeComponent } from './upload-home.component';

describe('UploadHomeComponent', () => {
  let component: UploadHomeComponent;
  let fixture: ComponentFixture<UploadHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
