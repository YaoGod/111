import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleStatisticsComponent } from './sale-statistics.component';

describe('SaleStatisticsComponent', () => {
  let component: SaleStatisticsComponent;
  let fixture: ComponentFixture<SaleStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
