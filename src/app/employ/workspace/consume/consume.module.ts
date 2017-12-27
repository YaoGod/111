import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {RouteGuardService} from "../../../service/route-guard/route-guard.service";
import {ConsAccountComponent} from "./cons-account/cons-account.component";
import {WashAccountComponent} from "./wash-account/wash-account.component";
import {ConsumeComponent} from "./consume.component";
import {FormsModule} from "@angular/forms";
import {TurnBarModule} from "../../../component/turn-bar/turn-bar.module";  /*使用[(ngModel)]所用的依赖*/

const routes: Routes = [
  {
    path: '',
    component: ConsumeComponent,
    children: [
      {
        path: '',
        canActivate: [RouteGuardService],
        redirectTo: 'consAccount',
        pathMatch: 'full'
      },
      {
        path: 'consAccount',
        component: ConsAccountComponent,
      },
      {
        path: 'washAccount',
        component: WashAccountComponent,
      },
      {
        path: '**',
        redirectTo: 'content',
        pathMatch: 'full'
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
  exports: [RouterModule],
  declarations: [ConsumeComponent, ConsAccountComponent, WashAccountComponent]
})
export class ConsumeModule { }
