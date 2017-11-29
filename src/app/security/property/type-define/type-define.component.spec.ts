import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeDefineComponent } from './type-define.component';

describe('TypeDefineComponent', () => {
  let component: TypeDefineComponent;
  let fixture: ComponentFixture<TypeDefineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeDefineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeDefineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
