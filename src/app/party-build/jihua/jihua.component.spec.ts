import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JihuaComponent } from './jihua.component';

describe('JihuaComponent', () => {
  let component: JihuaComponent;
  let fixture: ComponentFixture<JihuaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JihuaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JihuaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
