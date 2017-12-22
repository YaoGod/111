import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnBarComponent } from './turn-bar.component';

describe('TurnBarComponent', () => {
  let component: TurnBarComponent;
  let fixture: ComponentFixture<TurnBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TurnBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
