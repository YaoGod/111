import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RouteGuardService } from '../service/route-guard/route-guard.service';
import { SecurityComponent } from './security.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: SecurityComponent,
    children: [
      {
        path: '',
        redirectTo: 'basic',
        pathMatch: 'full'
      },
      {
        path: 'basic',
        loadChildren: './basic-info/basic-info.module#BasicInfoModule'
      },
      {
        path: 'daily',
        loadChildren: './daily-mag/daily-mag.module#DailyMagModule'
      },
      {
        path: 'property',
        loadChildren: './property/property.module#PropertyModule'
      }
      ,{
        path:'parking',
        loadChildren: './parking-lot/parking-lot.module#ParkingLotModule'
      },
      {
        /*出入安全管理模块*/
        path:'entrySecurity',
        loadChildren: './entry-security/entry-security.module#EntrySecurityModule'
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers: [RouteGuardService],
  declarations: [ SecurityComponent]
})
export class SecurityModule { }
