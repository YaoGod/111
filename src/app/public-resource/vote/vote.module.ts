import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoteComponent } from './vote.component';
import {RouteGuardService} from "../../service/route-guard/route-guard.service";
import {RouterModule, Routes} from "@angular/router";
import {ImgurlModule} from "../../pipe/imgurl/imgurl.module";
import {HttpModule} from "@angular/http";
import {TurnBarModule} from "../../component/turn-bar/turn-bar.module";
import { VoteListComponent } from './vote-list/vote-list.component';
import { VoteMangComponent } from './vote-mang/vote-mang.component';
import { VotePushComponent } from './vote-push/vote-push.component';
import { VoteDetailComponent } from './vote-detail/vote-detail.component';
import { VoteStatisticsComponent } from './vote-statistics/vote-statistics.component';
import {FormsModule} from "@angular/forms";
import {WrapperPictureModule} from "../../component/wrapper-picture/wrapper-picture.module";
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: VoteComponent,
    children: [
      {
        path: '',
        component: VoteListComponent
      },
      {
        path: 'detail/:id',
        component: VoteDetailComponent
      },
      {
        path: 'manage',
        component: VoteMangComponent
      },
      {
        path: 'push',
        component: VotePushComponent
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    TurnBarModule,
    ImgurlModule,
    WrapperPictureModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers: [RouteGuardService],
  declarations: [VoteComponent, VoteListComponent, VoteMangComponent, VotePushComponent, VoteDetailComponent, VoteStatisticsComponent]
})
export class VoteModule { }
