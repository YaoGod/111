import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BulletindetailComponent } from './bulletindetail/bulletindetail.component';
import { BulletinlistComponent } from './bulletinlist/bulletinlist.component';
import {RouterModule, Routes} from "@angular/router";
import {RouteGuardService} from "../../service/route-guard/route-guard.service";
import {FormsModule} from "@angular/forms";
import {ActivityBulletinComponent} from "./activity-bulletin.component";

const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: ActivityBulletinComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        loadChildren: './bulletinlist/bulletinlist.module#BulletinlistModule'
      },
      {
        path: 'detail/:id',
        component: BulletindetailComponent
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
  declarations: [BulletindetailComponent, ActivityBulletinComponent]
})
export class ActivityBulletinModule { }
