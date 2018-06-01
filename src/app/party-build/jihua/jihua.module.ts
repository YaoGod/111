import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JihuaComponent } from './jihua.component';
import {FormsModule} from "@angular/forms";
import {GlobalFooterModule} from "../../component/global-footer/global-footer.module";
import {TurnBarModule} from "../../component/turn-bar/turn-bar.module";
import {RouterModule, Routes} from "@angular/router";
import {RouteGuardService} from "../../service/route-guard/route-guard.service";
import { JihuaListComponent } from './jihua-list/jihua-list.component';
import {JihuaDetailComponent} from "./jihua-detail/jihua-detail.component";
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: JihuaComponent,
    children: [
      {
        path: '',
        canActivate: [RouteGuardService],
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        canActivate: [RouteGuardService],
        component: JihuaListComponent,
      },
      {
        path: 'detail/:id',
        canActivate: [RouteGuardService],
        component: JihuaDetailComponent,
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GlobalFooterModule,
    TurnBarModule,
    RouterModule.forChild(routes),
  ],
  declarations: [JihuaComponent, JihuaListComponent,JihuaDetailComponent]
})
export class JihuaModule { }
