import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsnoticeComponent } from './goodsnotice.component';

describe('GoodsnoticeComponent', () => {
  let component: GoodsnoticeComponent;
  let fixture: ComponentFixture<GoodsnoticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsnoticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsnoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
