import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnionsComponent } from './unions.component';
import {RouterModule, Routes} from "@angular/router";
import {RouteGuardService} from "../service/route-guard/route-guard.service";
import {HttpModule} from "@angular/http";
import {FormsModule} from "@angular/forms";
import {TurnBarModule} from "../component/turn-bar/turn-bar.module";
import {ImgurlModule} from "../pipe/imgurl/imgurl.module";
import {WrapperPictureModule} from "../component/wrapper-picture/wrapper-picture.module";
import {TextareaModule} from "../pipe/textarea/textarea.module";
import {UnionsindexComponent} from "./unionsindex/unionsindex.component";
import {NavTitleModule} from "../component/nav-title/nav-title.module";
import {GlobalFooterModule} from "../component/global-footer/global-footer.module";
import { DetailComponent } from './detail/detail.component';
import { ExpectComponent } from './expect/expect.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: UnionsComponent,
    children: [
      {
       path: '',
       redirectTo: 'index',
       pathMatch: 'full'
       },
      {
        path: 'index',
        component: UnionsindexComponent
      },
      {
        path: 'detail/:id',
        component: DetailComponent
      },
      {
        path: 'expect',
        component: ExpectComponent
      },
      {
        path: 'liaoxiuyang',
        loadChildren:  './liaoxiuyang/liaoxiuyang.module#LiaoxiuyangModule'
      },
      {
        /*工作流配置*/
        path: 'congress',
        loadChildren:  './congress/congress.module#CongressModule'
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
    FormsModule,
    TurnBarModule,
    ImgurlModule,
    WrapperPictureModule,
    TextareaModule,
    RouterModule.forChild(routes),
  ],
  declarations: [UnionsComponent,UnionsindexComponent, DetailComponent, ExpectComponent]
})
export class UnionsModule { }
