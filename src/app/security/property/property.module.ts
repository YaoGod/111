import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RouteGuardService } from '../../service/route-guard/route-guard.service';
import { PropertyComponent } from './property.component';
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: PropertyComponent,
    children:[
      {
        path:'',
        redirectTo:'file',
        pathMatch:'full'
      },
      {
        path:'file',
        loadChildren:'./file/file.module#FileModule'
      },
      {
        path:'account',
        loadChildren:'./account/account.module#AccountModule'
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: [PropertyComponent]
})
export class PropertyModule { }
