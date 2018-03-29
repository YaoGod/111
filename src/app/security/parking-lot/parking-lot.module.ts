import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParkingLotComponent } from './parking-lot.component';
import {RouterModule, Routes} from "@angular/router";
import {RouteGuardService} from "../../service/route-guard/route-guard.service";
import {HttpModule} from "@angular/http";
import {NavTitleModule} from "../../component/nav-title/nav-title.module";
import {TurnBarModule} from "../../component/turn-bar/turn-bar.module";
import {ImgurlModule} from "../../pipe/imgurl/imgurl.module";
import {GlobalFooterModule} from "../../component/global-footer/global-footer.module";
import {FormsModule} from "@angular/forms";
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: ParkingLotComponent,
    children: [
      {
       path: '',
       redirectTo: "vehicle",
       pathMatch: 'full'
       },
      {
        path: 'vehicle',
        loadChildren: './vehicle-info/vehicle-info.module#VehicleInfoModule'
      },
      {
        path: 'permit',
        loadChildren: './permit/permit.module#PermitModule'
      },
      {
        path: 'luckDraw',
        loadChildren: './luck-draw/luck-draw.module#LuckDrawModule'
      },{
        path: 'space',
        loadChildren: './space/space.module#SpaceModule'
      }
    ]
  }
];


@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    NavTitleModule,
    TurnBarModule,
    FormsModule,
    ImgurlModule,
    GlobalFooterModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ParkingLotComponent]
})
export class ParkingLotModule { }
