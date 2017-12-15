import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexWelfareComponent } from './index-welfare.component';

describe('IndexWelfareComponent', () => {
  let component: IndexWelfareComponent;
  let fixture: ComponentFixture<IndexWelfareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexWelfareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexWelfareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
