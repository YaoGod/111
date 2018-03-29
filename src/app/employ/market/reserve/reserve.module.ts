import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupplierComponent } from './supplier/supplier.component';
import { GoodsComponent } from './goods/goods.component';
import {RouterModule, Routes} from "@angular/router";
import {RouteGuardService} from "../../../service/route-guard/route-guard.service";
import {ReserveComponent} from "./reserve.component";
import {FormsModule} from "@angular/forms";
import { GoodscartComponent } from './goodscart/goodscart.component';
import { GoodsordermanageComponent } from './goodsordermanage/goodsordermanage.component';
import { GoodsbuyComponent } from './goodsbuy/goodsbuy.component';
import { GoodsorderconfirmComponent } from './goodsorderconfirm/goodsorderconfirm.component';
import { GoodsorderComponent } from './goodsorder/goodsorder.component';
import { GoodsnoticeComponent } from './goodsnotice/goodsnotice.component';
import {TurnBarModule} from "../../../component/turn-bar/turn-bar.module";
import {PrintBarModule} from "../../../component/print-bar/print-bar.module";
import {ImgurlModule} from "../../../pipe/imgurl/imgurl.module";
import {GroupListModule} from "../../../security/property/group-list/group-list.module";
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: ReserveComponent,
    children: [
      {
        path: '',
        redirectTo: 'goodsbuy',
        pathMatch: 'full'
      },
      {
        path: 'goods',
        component: GoodsComponent
      },
      {
        path: 'supplier',
        component: SupplierComponent
      },
      {
        path: 'goodsbuy',
        component: GoodsbuyComponent
      },
      {
        path: 'goodscart',
        component: GoodscartComponent
      },
      {
        path: 'goodsorder',
        component: GoodsorderComponent
      },
      {
        path: 'goodsorder/:id',
        component: GoodsorderComponent
      },
      {
        path: 'goodsorderconfirm',
        component: GoodsorderconfirmComponent
      },
      {
        path: 'goodsordermanage',
        component: GoodsordermanageComponent
      },
      {
        path: 'goodsnotice',
        component: GoodsnoticeComponent
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TurnBarModule,
    PrintBarModule,
    ImgurlModule,
    GroupListModule,
    RouterModule.forChild(routes),
  ],
  declarations: [ReserveComponent,SupplierComponent, GoodsComponent, GoodscartComponent,
    GoodsordermanageComponent, GoodsbuyComponent, GoodsorderconfirmComponent, GoodsorderComponent, GoodsnoticeComponent]
})
export class ReserveModule { }
