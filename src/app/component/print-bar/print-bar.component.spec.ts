import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintBarComponent } from './print-bar.component';

describe('PrintBarComponent', () => {
  let component: PrintBarComponent;
  let fixture: ComponentFixture<PrintBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
