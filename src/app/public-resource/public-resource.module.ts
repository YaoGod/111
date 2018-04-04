import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RouteGuardService } from '../service/route-guard/route-guard.service';
import {GlobalFooterModule} from "../component/global-footer/global-footer.module";
import {TurnBarModule} from "../component/turn-bar/turn-bar.module";
import {ImgurlModule} from "../pipe/imgurl/imgurl.module";
import {HttpModule} from "@angular/http";
import {NavTitleModule} from "../component/nav-title/nav-title.module";
import { PublicResourceComponent } from './public-resource.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: PublicResourceComponent,
    children: [
      /*{
        path: '',
        redirectTo: 'share',
        pathMatch: 'full'
      },*/
      {
        path: 'vote',
        loadChildren: './vote/vote.module#VoteModule'
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
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers: [RouteGuardService],
  declarations: [PublicResourceComponent]
})
export class PublicResourceModule { }
