import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudyComponent } from './study.component';
import {RouterModule, Routes} from "@angular/router";
import {RouteGuardService} from "../../service/route-guard/route-guard.service";
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: StudyComponent,
    /*children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        loadChildren: './subunitlist/subunitlist.module#SubunitlistModule'
      },
      {
        path: 'detail/:id',
        component: SubunitdetailComponent
      }
    ]*/
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  declarations: [StudyComponent]
})
export class StudyModule { }
