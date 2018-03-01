import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CleanDishesComponent } from './clean-dishes.component';
import {RouterModule, Routes} from "@angular/router";
import {RouteGuardService} from "../../../service/route-guard/route-guard.service";
import {VegorderComponent} from "./vegorder/vegorder.component";
import {VegetableComponent} from "./vegetable/vegetable.component";
import {VegcartComponent} from "./vegcart/vegcart.component";
import {VegbuyComponent} from "./vegbuy/vegbuy.component";
import {MyorderComponent} from "./myorder/myorder.component";
import {ConfirmvegcartComponent} from "./confirmvegcart/confirmvegcart.component";
import {FormsModule} from "@angular/forms";
import { VegetableCountComponent } from './vegetable-count/vegetable-count.component';
import {TurnBarModule} from "../../../component/turn-bar/turn-bar.module";
import {PrintBarModule} from "../../../component/print-bar/print-bar.module";
import {ImgurlModule} from "../../../pipe/imgurl/imgurl.module";

const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: CleanDishesComponent,
    children: [
      {
        path: '',
        redirectTo: 'vegbuy',
        pathMatch: 'full'
      },
      {
        path: 'vegtable',
        component:VegetableComponent
      },
      {
        path: 'vegorder',
        component:VegorderComponent
      },
      {
        path: 'vegbuy',
        component:VegbuyComponent
      },
      {
        path: 'vegcart',
        component:VegcartComponent
      },
      {
        path: 'myorder',
        component:MyorderComponent
      },
      {
        path: 'myorder/:id',
        component:MyorderComponent
      },
      {
        path: 'confirmvegcart',
        component:ConfirmvegcartComponent
      },
      {
        path: 'count',
        component: VegetableCountComponent
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
    RouterModule.forChild(routes),
  ],
  declarations: [CleanDishesComponent,VegorderComponent,VegetableComponent,VegcartComponent,VegbuyComponent,MyorderComponent,
    ConfirmvegcartComponent,
    VegetableCountComponent]
})
export class CleanDishesModule { }
