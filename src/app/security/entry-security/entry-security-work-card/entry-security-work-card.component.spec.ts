import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrySecurityWorkCardComponent } from './entry-security-work-card.component';

describe('EntrySecurityWorkCardComponent', () => {
  let component: EntrySecurityWorkCardComponent;
  let fixture: ComponentFixture<EntrySecurityWorkCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntrySecurityWorkCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntrySecurityWorkCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
