import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareCheckComponent } from './share-check.component';

describe('ShareCheckComponent', () => {
  let component: ShareCheckComponent;
  let fixture: ComponentFixture<ShareCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
