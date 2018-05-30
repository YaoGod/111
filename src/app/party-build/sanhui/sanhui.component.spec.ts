import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SanhuiComponent } from './sanhui.component';

describe('SanhuiComponent', () => {
  let component: SanhuiComponent;
  let fixture: ComponentFixture<SanhuiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SanhuiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SanhuiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
