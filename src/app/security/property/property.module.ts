import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RouteGuardService } from '../../service/route-guard/route-guard.service';
import { PropertyComponent } from './property.component';
import { NavTitleModule } from '../../component/nav-title/nav-title.module';
import { GlobalFooterModule } from '../../component/global-footer/global-footer.module';
import { GlobalOptionService } from './global-option.service';
import {ImgurlModule} from "../../pipe/imgurl/imgurl.module";
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
    NavTitleModule,
    GlobalFooterModule,
    ImgurlModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: [GlobalOptionService],
  declarations: [PropertyComponent]
})
export class PropertyModule { }
