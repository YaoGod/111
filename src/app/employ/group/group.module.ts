import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomepageComponent } from './homepage/homepage.component';
import { Routes, RouterModule } from '@angular/router';
import { GroupNoticeService } from '../../service/group-notice/group-notice.service';
import { GroupProductService } from '../../service/group-product/group-product.service';
import { ProductComponent } from './product/product.component';
import { GlobalFooterModule } from  '../../component/global-footer/global-footer.module';
import { OrderComponent } from './order/order.component';
import { GroupbuyComponent } from './groupbuy/groupbuy.component';
import { NoticeComponent } from './notice/notice.component';
import { FormsModule } from "@angular/forms";
import { CartComponent } from './cart/cart.component';
import { GroupComponent } from './group.component';
import {ConfirmCartComponent} from "./confirm-cart/confirm-cart.component";
import {MyorderComponent} from "./myorder/myorder.component";
import {TurnBarModule} from "../../component/turn-bar/turn-bar.module";
import { SlideImgComponent } from './slide-img/slide-img.component';
import { CheckComponent } from './check/check.component';
import { ManagerComponent } from './manager/manager.component';
import { ReportComponent } from './report/report.component';
import { CountComponent } from './count/count.component';
import {ImgurlModule} from "../../pipe/imgurl/imgurl.module";
const routes: Routes = [
  { path: '',
    component : GroupComponent,
    children :[
      {
        path: '',
        redirectTo: 'groupbuy',
        pathMatch: 'full',
        component:HomepageComponent
      },
      {
        path: 'product',
        component:ProductComponent
      },
      {
        path: 'order',
        component:OrderComponent
      },
      {
        path: 'groupbuy',
        component:GroupbuyComponent
      },
      {
        path: 'notice',
        component:NoticeComponent
      },
      {
        path:'cart',
        component:CartComponent
      },
      {
        path:'confirmCart',
        component:ConfirmCartComponent
      },
      {
        path:'myorder',
        component:MyorderComponent
      },
      {
        path:'myorder/:id',
        component:MyorderComponent
      },
      {
        path: 'check',
        component:CheckComponent
      },{
        path: 'manager',
        component:ManagerComponent
      },{
        path: 'report',
        component:ReportComponent
      },{
        path: 'count',
        component:CountComponent
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TurnBarModule,
    GlobalFooterModule,
    ImgurlModule,
    RouterModule.forChild(routes)
  ],
  exports:[RouterModule],
  declarations: [HomepageComponent, ProductComponent, OrderComponent, GroupbuyComponent, NoticeComponent, CartComponent,
    GroupComponent, ConfirmCartComponent, MyorderComponent, SlideImgComponent, CheckComponent, ManagerComponent,
    ReportComponent, CountComponent]
})
export class GroupModule { }
