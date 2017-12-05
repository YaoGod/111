import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketComponent } from './market.component';
import { RouteGuardService } from '../../service/route-guard/route-guard.service';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: MarketComponent,
    children: []
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  declarations: [MarketComponent]
})
export class MarketModule { }
