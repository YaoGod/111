import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyBuildComponent } from './party-build.component';

describe('PartyBuildComponent', () => {
  let component: PartyBuildComponent;
  let fixture: ComponentFixture<PartyBuildComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartyBuildComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyBuildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
