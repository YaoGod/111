import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureComponent } from './feature.component';
import {RouterModule, Routes} from "@angular/router";
import {RouteGuardService} from "../../service/route-guard/route-guard.service";

const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: FeatureComponent,
    /*children: [
     {
     path: '',
     redirectTo: 'list',
     pathMatch: 'full'
     },
     {
     path: 'list',
     loadChildren: './subunitlist/subunitlist.module#SubunitlistModule'
     },
     {
     path: 'detail/:id',
     component: SubunitdetailComponent
     }
     ]*/
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  declarations: [FeatureComponent]
})
export class FeatureModule { }
