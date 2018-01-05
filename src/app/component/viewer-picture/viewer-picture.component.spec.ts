import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerPictureComponent } from './viewer-picture.component';

describe('ViewerPictureComponent', () => {
  let component: ViewerPictureComponent;
  let fixture: ComponentFixture<ViewerPictureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewerPictureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewerPictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
