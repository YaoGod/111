import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {RouteGuardService} from "../../service/route-guard/route-guard.service";
import {DangweiDetailComponent} from "./dangwei-detail/dangwei-detail.component";
import { DangweiComponent } from './dangwei.component';
import { DangweiListComponent } from './dangwei-list/dangwei-list.component';
import {FormsModule} from "@angular/forms";
import {GlobalFooterModule} from "../../component/global-footer/global-footer.module";
import {TurnBarModule} from "../../component/turn-bar/turn-bar.module";
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: DangweiComponent,
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
        component: DangweiListComponent,
      },
      {
        path: 'detail/:id',
        canActivate: [RouteGuardService],
        component: DangweiDetailComponent,
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
  declarations: [DangweiDetailComponent, DangweiComponent, DangweiListComponent]
})
export class DangweiModule { }
