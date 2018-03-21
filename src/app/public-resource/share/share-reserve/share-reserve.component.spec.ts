import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareReserveComponent } from './share-reserve.component';

describe('ShareReserveComponent', () => {
  let component: ShareReserveComponent;
  let fixture: ComponentFixture<ShareReserveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareReserveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareReserveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
