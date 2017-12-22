import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupermarketComponent } from './supermarket.component';
import {RouterModule, Routes} from "@angular/router";
import {RouteGuardService} from "../../../service/route-guard/route-guard.service";

const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: SupermarketComponent,
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  declarations: [SupermarketComponent]
})
export class SupermarketModule { }
