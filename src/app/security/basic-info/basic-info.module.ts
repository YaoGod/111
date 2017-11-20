import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { BasicInfoComponent } from './basic-info.component';
import { Routes, RouterModule } from '@angular/router';
import { RouteGuardService } from '../../service/route-guard/route-guard.service';
import { GlobalFooterModule } from './global-footer/global-footer.module';
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: BasicInfoComponent,
    children:[
      {
        path:'',
        loadChildren:'./homepage/homepage.module#HomepageModule'
      },
      {
        path:'detail/:id',
        loadChildren:'./building/building.module#BuildingModule'
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    GlobalFooterModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: [BasicInfoComponent]
})
export class BasicInfoModule { }
