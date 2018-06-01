import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeCasesComponent } from './practice-cases.component';

describe('PracticeCasesComponent', () => {
  let component: PracticeCasesComponent;
  let fixture: ComponentFixture<PracticeCasesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PracticeCasesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeCasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
