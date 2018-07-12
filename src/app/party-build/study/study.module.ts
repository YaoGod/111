import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudyComponent } from './study.component';
import {RouterModule, Routes} from "@angular/router";
import {RouteGuardService} from "../../service/route-guard/route-guard.service";
import { StudyListComponent } from './study-list/study-list.component';
import {FormsModule} from "@angular/forms";
import {TurnBarModule} from "../../component/turn-bar/turn-bar.module";
import {StudyDetailComponent} from "./study-detail/study-detail.component";
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: StudyComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: StudyListComponent
      },
      {
        path: 'detail/:id',
        component: StudyDetailComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TurnBarModule,
    RouterModule.forChild(routes),
  ],
  declarations: [StudyComponent, StudyListComponent, StudyDetailComponent]
})
export class StudyModule { }
