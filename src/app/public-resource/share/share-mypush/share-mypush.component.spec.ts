import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareMypushComponent } from './share-mypush.component';

describe('ShareMypushComponent', () => {
  let component: ShareMypushComponent;
  let fixture: ComponentFixture<ShareMypushComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareMypushComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareMypushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
