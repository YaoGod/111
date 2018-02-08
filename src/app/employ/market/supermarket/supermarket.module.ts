import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupplierComponent } from './supermarketApplier/supplier.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { GlobalFooterModule } from '../../../component/global-footer/global-footer.module';
import { SupbuyComponent } from './supbuy/supbuy.component';
import { GoodsComponent } from './goods/goods.component';
import { MyorderComponent } from './myorder/myorder.component';
import { SupermarketOrderComponent } from './supermarketOrder/supermarketOrder.component';
import { ConfirmsupcartComponent } from './confirmsupcart/confirmsupcart.component';
import { SupbuysimpleComponent } from './supbuysimple/supbuysimple.component';
import { MinLengthPipe } from './supermarketApplier/min-length.pipe';
import { MycartComponent } from './mycart/mycart.component';
import {SupermarketComponent} from "./supermarket.component";
import {RouteGuardService} from "../../../service/route-guard/route-guard.service";
import {SupermarketManagerService} from "../../../service/supermarket-manager/supermarket-manager.service";
import {TurnBarModule} from "../../../component/turn-bar/turn-bar.module";
import { SupermarketCountComponent } from './supermarket-count/supermarket-count.component';
import {PrintBarModule} from "../../../component/print-bar/print-bar.module";
import {ImgurlModule} from "../../../pipe/imgurl/imgurl.module";
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: SupermarketComponent,
    children: [
      {
        path: "",
        redirectTo: 'supbuy',
        pathMatch:"full"
      },
      {
        path: 'supermarketApplier',
        component:SupplierComponent
      },
      {
        path: 'supbuy',
        component:SupbuyComponent
      },
      {
        path: 'supermarketProduct',
        component:GoodsComponent
      },
      {
        path: 'order',
        component:SupermarketOrderComponent
      },
      {
        path:'supbuysimple',
        component:SupbuysimpleComponent
      },
      {
        path: 'myorder',
        component:MyorderComponent
      },
      {
        path: 'mycart',
        component:MycartComponent
      },
      {
        path: 'confirmcart',
        component:ConfirmsupcartComponent
      },
      {
        path: 'count',
        component:SupermarketCountComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GlobalFooterModule,
    TurnBarModule,
    PrintBarModule,
    ImgurlModule,
    RouterModule.forChild(routes),
  ],
  providers: [SupermarketManagerService],
  declarations: [SupermarketComponent,
    SupplierComponent, SupbuyComponent, MyorderComponent,
    SupermarketOrderComponent, ConfirmsupcartComponent,
    SupbuysimpleComponent,GoodsComponent, MinLengthPipe, MycartComponent, SupermarketCountComponent]
})
export class SupermarketModule { }
