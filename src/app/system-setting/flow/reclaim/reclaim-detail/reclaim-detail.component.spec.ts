import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReclaimDetailComponent } from './reclaim-detail.component';

describe('ReclaimDetailComponent', () => {
  let component: ReclaimDetailComponent;
  let fixture: ComponentFixture<ReclaimDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReclaimDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReclaimDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
