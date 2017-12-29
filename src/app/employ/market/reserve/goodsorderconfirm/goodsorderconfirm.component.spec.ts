import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsorderconfirmComponent } from './goodsorderconfirm.component';

describe('GoodsorderconfirmComponent', () => {
  let component: GoodsorderconfirmComponent;
  let fixture: ComponentFixture<GoodsorderconfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsorderconfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsorderconfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
