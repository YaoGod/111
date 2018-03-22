import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareResellComponent } from './share-resell.component';

describe('ShareResellComponent', () => {
  let component: ShareResellComponent;
  let fixture: ComponentFixture<ShareResellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareResellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareResellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
