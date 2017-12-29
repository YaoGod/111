import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsordermanageComponent } from './goodsordermanage.component';

describe('GoodsordermanageComponent', () => {
  let component: GoodsordermanageComponent;
  let fixture: ComponentFixture<GoodsordermanageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsordermanageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsordermanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
