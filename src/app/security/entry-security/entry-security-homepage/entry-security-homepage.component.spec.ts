import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrySecurityHomepageComponent } from './entry-security-homepage.component';

describe('EntrySecurityHomepageComponent', () => {
  let component: EntrySecurityHomepageComponent;
  let fixture: ComponentFixture<EntrySecurityHomepageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntrySecurityHomepageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntrySecurityHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
