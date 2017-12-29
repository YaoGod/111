import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsorderComponent } from './goodsorder.component';

describe('GoodsorderComponent', () => {
  let component: GoodsorderComponent;
  let fixture: ComponentFixture<GoodsorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
