import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RouteGuardService } from '../service/route-guard/route-guard.service';
import {PartyBuildComponent} from "./party-build.component";
import {FormsModule} from "@angular/forms";
import {TurnBarModule} from "../component/turn-bar/turn-bar.module";
import {NavTitleModule} from "../component/nav-title/nav-title.module";
import {GlobalFooterModule} from "../component/global-footer/global-footer.module";

const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: PartyBuildComponent,
    children: [
      {
        path: '',
        redirectTo: 'upload',
        pathMatch: 'full'
      },
      {
        path: 'upload',
        loadChildren: './upload/upload.module#UploadModule'
      },
      {
        path: 'export',
        loadChildren: './export/export.module#ExportModule'
      },
      {
        path: 'exportDetail/:id',
        loadChildren: './export-detail/export-detail.module#ExportDetailModule'
      },
      {
        path: 'sanhui',
        loadChildren: './sanhui/sanhui.module#SanhuiModule'
      },
      {
        path: 'liuhao',
        loadChildren: './liuhao/liuhao.module#LiuhaoModule'
      },
      {
        path: 'subunit',
        loadChildren: './subunit/subunit.module#SubunitModule'
      },
      {// 活动简报
        path: 'bulletin',
        loadChildren: './activity-bulletin/activity-bulletin.module#ActivityBulletinModule'
      },
      {// 实践案例
        path: 'practice',
        loadChildren: './practice-cases/practice-cases.module#PracticeCasesModule'
      },
      {
        path: 'dangwei',
        loadChildren: './dangwei/dangwei.module#DangweiModule'
      },
      {
        path: 'jihua',
        loadChildren: './jihua/jihua.module#JihuaModule'
      },
      {
        path: 'feature',
        loadChildren: './feature/feature.module#FeatureModule'
      },
      {
        path: 'study',
        loadChildren: './study/study.module#StudyModule'
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    TurnBarModule,
    FormsModule,
    NavTitleModule,
    GlobalFooterModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers: [RouteGuardService],
  declarations: [PartyBuildComponent]
})
export class PartyBuildModule { }
