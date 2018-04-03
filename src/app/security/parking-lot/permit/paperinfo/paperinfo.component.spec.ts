import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperinfoComponent } from './paperinfo.component';

describe('PaperinfoComponent', () => {
  let component: PaperinfoComponent;
  let fixture: ComponentFixture<PaperinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaperinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaperinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
