import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketComponent } from './market.component';
import { RouteGuardService } from '../../service/route-guard/route-guard.service';
import { Routes, RouterModule } from '@angular/router';
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {NavTitleModule} from "../../component/nav-title/nav-title.module";
import {GlobalFooterModule} from "../../component/global-footer/global-footer.module";
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: MarketComponent,
    children: [
      {
        path: '',
        redirectTo: 'cleanDishes',
        pathMatch: 'full'
      },
      {
        path: 'reserve',
        loadChildren: './reserve/reserve.module#ReserveModule'
      },
      {
        path: 'supermarket',
        loadChildren: './supermarket/supermarket.module#SupermarketModule'
      },
      {
        path: 'cleanDishes',
        loadChildren: './clean-dishes/clean-dishes.module#CleanDishesModule'
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    NavTitleModule,
    GlobalFooterModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  declarations: [MarketComponent]
})
export class MarketModule { }
