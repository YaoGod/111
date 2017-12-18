import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SraffWelfareListComponent } from './sraff-welfare-list.component';

describe('SraffWelfareListComponent', () => {
  let component: SraffWelfareListComponent;
  let fixture: ComponentFixture<SraffWelfareListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SraffWelfareListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SraffWelfareListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
