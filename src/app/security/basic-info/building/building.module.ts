import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuildingComponent } from './building.component';
import { Routes, RouterModule } from '@angular/router';
import { RouteGuardService } from '../../../service/route-guard/route-guard.service';
import { GlobalBuildingService } from '../../../service/global-building/global-building.service';
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: BuildingComponent,
    children:[
      {
        path: '',
        redirectTo: 'belong',
        pathMatch:'full'
      },
      {
        path: 'belong',
        canActivate: [RouteGuardService],
        loadChildren: '../msg-belong/msg-belong.module#MsgBelongModule'
      },
      {
        path: 'basic',
        canActivate: [RouteGuardService],
        loadChildren: '../msg-basic/msg-basic.module#MsgBasicModule'
      },
      {
        path: 'floor',
        canActivate: [RouteGuardService],
        loadChildren: '../msg-floor/msg-floor.module#MsgFloorModule'
      },
      {
        path: 'room/:id',
        canActivate: [RouteGuardService],
        loadChildren: '../room/room.module#RoomModule'
      },
      {
        path: 'contract/:type',
        canActivate: [RouteGuardService],
        loadChildren: '../msg-contract/msg-contract.module#MsgContractModule'
      },
      {
        path: 'property',
        canActivate: [RouteGuardService],
        loadChildren: '../msg-contract-pro/msg-contract-pro.module#MsgContractProModule'
      },
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers:[ GlobalBuildingService ],
  declarations: [BuildingComponent]
})
 /*大楼基本信息单页*/
export class BuildingModule { }
