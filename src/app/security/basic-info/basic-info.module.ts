import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { BasicInfoComponent } from './basic-info.component';
import { Routes, RouterModule } from '@angular/router';
import { RouteGuardService } from '../../service/route-guard/route-guard.service';
import { NavTitleModule } from '../../component/nav-title/nav-title.module';
import { GlobalFooterModule } from '../../component/global-footer/global-footer.module';
import {TurnBarModule} from "../../component/turn-bar/turn-bar.module";
import {ImgurlModule} from "../../pipe/imgurl/imgurl.module";
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: BasicInfoComponent,
    children:[
      {
        path:'',
        loadChildren:'./homepage/homepage.module#HomepageModule'
      },
      {
        path:'detail/:id',
        loadChildren:'./building/building.module#BuildingModule'
      },
      {
        path: 'detail/:id/room/:id',
        canActivate: [RouteGuardService],
        loadChildren: './room/room.module#RoomModule'
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    NavTitleModule,
    GlobalFooterModule,
    TurnBarModule,
    ImgurlModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: [BasicInfoComponent]
})
export class BasicInfoModule { }
