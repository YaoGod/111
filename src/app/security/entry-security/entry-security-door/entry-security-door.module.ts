///<reference path="../../../../../node_modules/@angular/router/src/router_module.d.ts"/>
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouteGuardService} from "../../../service/route-guard/route-guard.service";
import {RouterModule, Routes} from "@angular/router";
import {ImgurlModule} from "../../../pipe/imgurl/imgurl.module";
import {TurnBarModule} from "../../../component/turn-bar/turn-bar.module";
import {GlobalFooterModule} from "../../../component/global-footer/global-footer.module";
import {NavTitleModule} from "../../../component/nav-title/nav-title.module";
import {HttpModule} from "@angular/http";
import {FormsModule} from "@angular/forms";
import {EntrySecurityDoorComponent} from "./entry-security-door.component";
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: EntrySecurityDoorComponent,
    children: [
      /*这里其实结构和工号牌的差不多的结构，你可以参照的搭你需要的部分*/
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    NavTitleModule,
    GlobalFooterModule,
    TurnBarModule,
    ImgurlModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers: [RouteGuardService],
  declarations: [EntrySecurityDoorComponent]
})
export class EntrySecurityDoorModule { }
