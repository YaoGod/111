import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JihuaDetailComponent } from './jihua-detail.component';

describe('JihuaDetailComponent', () => {
  let component: JihuaDetailComponent;
  let fixture: ComponentFixture<JihuaDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JihuaDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JihuaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
