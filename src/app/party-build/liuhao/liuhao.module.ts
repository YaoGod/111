import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiuhaoComponent } from './liuhao.component';
import {RouteGuardService} from "../../service/route-guard/route-guard.service";
import {RouterModule, Routes} from "@angular/router";
import {LiuhaodetailComponent} from "./liuhaodetail/liuhaodetail.component";
import {FormsModule} from "@angular/forms";
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: LiuhaoComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        loadChildren: './liuhaolist/liuhaolist.module#LiuhaolistModule'
      },
      {
        path: 'detail/:id',
        component: LiuhaodetailComponent
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [LiuhaoComponent,LiuhaodetailComponent]
})
export class LiuhaoModule { }
