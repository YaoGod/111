import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SanhuilistComponent } from './sanhuilist.component';

describe('SanhuilistComponent', () => {
  let component: SanhuilistComponent;
  let fixture: ComponentFixture<SanhuilistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SanhuilistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SanhuilistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
