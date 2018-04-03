import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrySecurityDoorComponent } from './entry-security-door.component';

describe('EntrySecurityDoorComponent', () => {
  let component: EntrySecurityDoorComponent;
  let fixture: ComponentFixture<EntrySecurityDoorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntrySecurityDoorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntrySecurityDoorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
