import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SanhuiComponent } from './sanhui.component';
import {RouterModule, Routes} from "@angular/router";
import {RouteGuardService} from "../../service/route-guard/route-guard.service";
import {FormsModule} from "@angular/forms";
import { SanhuidetailComponent } from './sanhuidetail/sanhuidetail.component';
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: SanhuiComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        loadChildren: './sanhuilist/sanhuilist.module#SanhuilistModule'
      },
      {
        path: 'detail/:id',
        component: SanhuidetailComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [SanhuiComponent, SanhuidetailComponent]
})
export class SanhuiModule { }
