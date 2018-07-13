import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureComponent } from './feature.component';
import {RouterModule, Routes} from "@angular/router";
import {RouteGuardService} from "../../service/route-guard/route-guard.service";
import { FeaturedetailComponent } from './featuredetail/featuredetail.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: FeatureComponent,
    children: [
     {
     path: '',
     redirectTo: 'list',
     pathMatch: 'full'
     },
     {
     path: 'list',
     loadChildren: './featurelist/featurelist.module#FeaturelistModule'
     },
     {
     path: 'detail/:id',
     component: FeaturedetailComponent
     }
     ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  declarations: [FeatureComponent, FeaturedetailComponent]
})
export class FeatureModule { }
