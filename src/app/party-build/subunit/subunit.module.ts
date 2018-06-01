import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubunitComponent } from './subunit.component';
import { SubunitdetailComponent } from './subunitdetail/subunitdetail.component';
import {RouterModule, Routes} from "@angular/router";
import {RouteGuardService} from "../../service/route-guard/route-guard.service";
import {FormsModule} from "@angular/forms";
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: SubunitComponent,
    children: [
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
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [SubunitComponent, SubunitdetailComponent]
})
export class SubunitModule { }
