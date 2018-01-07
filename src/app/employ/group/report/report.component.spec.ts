import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as $ from 'jquery';
import { GroupOrderService } from '../../../service/group-order/group-order.service';
import { ReportComponent } from './report.component';
import {GroupOrderItem} from '../../../mode/groupOrderItem/group-orderItem.service'
import { GroupOrderItemService } from '../../../service/group-orderItem/group-order-item.service';
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
describe('ReportComponent', () => {
  let component: ReportComponent;
  let fixture: ComponentFixture<ReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
