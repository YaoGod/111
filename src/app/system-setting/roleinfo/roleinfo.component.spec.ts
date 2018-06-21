import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleinfoComponent } from './roleinfo.component';

describe('RoleinfoComponent', () => {
  let component: RoleinfoComponent;
  let fixture: ComponentFixture<RoleinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
