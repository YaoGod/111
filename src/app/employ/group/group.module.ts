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
const routes: Routes = [
  { path: '',
    component : GroupComponent,
    children :[
      {
        path: '',
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
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GlobalFooterModule,
    RouterModule.forChild(routes)
  ],
  exports:[RouterModule],
  declarations: [HomepageComponent, ProductComponent, OrderComponent, GroupbuyComponent, NoticeComponent, CartComponent, GroupComponent]
})
export class GroupModule { }
