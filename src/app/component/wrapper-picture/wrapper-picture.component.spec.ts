import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapperPictureComponent } from './wrapper-picture.component';

describe('WrapperPictureComponent', () => {
  let component: WrapperPictureComponent;
  let fixture: ComponentFixture<WrapperPictureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WrapperPictureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperPictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
