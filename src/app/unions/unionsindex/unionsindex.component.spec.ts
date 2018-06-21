import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnionsindexComponent } from './unionsindex.component';

describe('UnionsindexComponent', () => {
  let component: UnionsindexComponent;
  let fixture: ComponentFixture<UnionsindexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnionsindexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnionsindexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
