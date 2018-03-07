import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleMangComponent } from './sale-mang.component';

describe('SaleMangComponent', () => {
  let component: SaleMangComponent;
  let fixture: ComponentFixture<SaleMangComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleMangComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleMangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
