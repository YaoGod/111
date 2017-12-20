import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupplierComponent } from './supplier/supplier.component';
import { GoodsComponent } from './goods/goods.component';
import {RouterModule, Routes} from "@angular/router";
import {RouteGuardService} from "../../../service/route-guard/route-guard.service";
import {ReserveComponent} from "./reserve.component";
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: ReserveComponent,
    children: [
      {
        path: '',
        redirectTo: 'goods',
        pathMatch: 'full'
      },
      {
        path: 'goods',
        component: GoodsComponent
      },
      {
        path: 'supplier',
        component: SupplierComponent
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  declarations: [ReserveComponent,SupplierComponent, GoodsComponent]
})
export class ReserveModule { }
