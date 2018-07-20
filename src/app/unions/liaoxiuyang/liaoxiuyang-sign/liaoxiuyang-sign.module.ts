import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignListComponent } from './sign-list/sign-list.component';
import { SignAddComponent } from './sign-add/sign-add.component';
import {LiaoxiuyangSignComponent} from "./liaoxiuyang-sign.component";
import {RouterModule, Routes} from "@angular/router";
import {RouteGuardService} from "../../../service/route-guard/route-guard.service";
import {FormsModule} from "@angular/forms";
import {TurnBarModule} from "../../../component/turn-bar/turn-bar.module";

const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: LiaoxiuyangSignComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: SignListComponent
      },
      {
        path: 'add/:id',
        component: SignAddComponent
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
  declarations: [LiaoxiuyangSignComponent,SignListComponent, SignAddComponent]
})
export class LiaoxiuyangSignModule { }
