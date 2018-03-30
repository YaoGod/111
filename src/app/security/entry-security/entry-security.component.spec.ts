import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrySecurityComponent } from './entry-security.component';

describe('EntrySecurityComponent', () => {
  let component: EntrySecurityComponent;
  let fixture: ComponentFixture<EntrySecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntrySecurityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntrySecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
