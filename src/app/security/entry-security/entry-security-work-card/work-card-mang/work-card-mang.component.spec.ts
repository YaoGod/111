import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkCardMangComponent } from './work-card-mang.component';

describe('WorkCardMangComponent', () => {
  let component: WorkCardMangComponent;
  let fixture: ComponentFixture<WorkCardMangComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkCardMangComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkCardMangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
