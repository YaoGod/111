import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnionsComponent } from './unions.component';

describe('UnionsComponent', () => {
  let component: UnionsComponent;
  let fixture: ComponentFixture<UnionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
