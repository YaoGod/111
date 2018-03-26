import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareHomepageComponent } from './share-homepage.component';

describe('ShareHomepageComponent', () => {
  let component: ShareHomepageComponent;
  let fixture: ComponentFixture<ShareHomepageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareHomepageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
