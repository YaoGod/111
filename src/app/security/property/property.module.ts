import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RouteGuardService } from '../../service/route-guard/route-guard.service';
import { PropertyComponent } from './property.component';
import { GlobalFooterModule } from '../basic-info/global-footer/global-footer.module';
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: PropertyComponent,
    children:[
   /*   {
        path:'',
        redirectTo:'file',
        pathMatch:'full'
      },*/
      {
        path:'',
        loadChildren:'./front/front.module#FrontModule'
      },
      {
        path:'type',
        loadChildren:'./type-define/type-define.module#TypeDefineModule'
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    GlobalFooterModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: [PropertyComponent]
})
export class PropertyModule { }
