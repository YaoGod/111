import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RouteGuardService } from '../service/route-guard/route-guard.service';
import {PartyBuildComponent} from "./party-build.component";
import {FormsModule} from "@angular/forms";
import {TurnBarModule} from "../component/turn-bar/turn-bar.module";
import {NavTitleModule} from "../component/nav-title/nav-title.module";
import {GlobalFooterModule} from "../component/global-footer/global-footer.module";
import { UploadHomeComponent } from './upload-home/upload-home.component';

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
        path: 'home',
        component: UploadHomeComponent
      },
      {
        path: 'uploaddetail',
        loadChildren: './upload-detail/upload-detail.module#UploadDetailModule'
      },
      {
        path: 'sanhui',
        loadChildren: './sanhui/sanhui.module#SanhuiModule'
      },
      {
        path: 'dangwei',
        loadChildren: './dangwei/dangwei.module#DangweiModule'
      },
      {
        path: 'jihua',
        loadChildren: './jihua/jihua.module#JihuaModule'
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
  declarations: [PartyBuildComponent, UploadHomeComponent]
})
export class PartyBuildModule { }
