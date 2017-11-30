import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FrontComponent } from './front.component';
import { Routes, RouterModule } from '@angular/router';
import { RouteGuardService } from '../../../service/route-guard/route-guard.service';
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: FrontComponent,
    children: [
       {
       path:'',
       redirectTo:'account',
       pathMatch:'full'
       },
      {
        path:'file',
        loadChildren:'../file/file.module#FileModule'
      },
      {
        path:'account',
        loadChildren:'../account/account.module#AccountModule'
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: [FrontComponent]
})
export class FrontModule { }
