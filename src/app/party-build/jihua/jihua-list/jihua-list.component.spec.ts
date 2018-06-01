import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JihuaListComponent } from './jihua-list.component';

describe('JihuaListComponent', () => {
  let component: JihuaListComponent;
  let fixture: ComponentFixture<JihuaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JihuaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JihuaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
