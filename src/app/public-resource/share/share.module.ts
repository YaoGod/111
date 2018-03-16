import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ShareComponent } from './share.component';
import {RouteGuardService} from "../../service/route-guard/route-guard.service";
import { ShareHomepageComponent } from './share-homepage/share-homepage.component';
import { ShareDetailComponent } from './share-detail/share-detail.component';
import { ShareMypushComponent } from './share-mypush/share-mypush.component';
import { ShareCheckComponent } from './share-check/share-check.component';
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: ShareComponent,
    children: [
      {
        path: '',
        redirectTo: 'homepage',
        pathMatch: 'full'
      },
      {
        path: 'homepage',
        component: ShareHomepageComponent
      },
      {
        path: 'detail/:id',
        component: ShareDetailComponent
      },
      {
        path: "myPush",
        component: ShareMypushComponent
      },
      {
        path: "check",
        component: ShareCheckComponent
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  declarations: [ShareComponent, ShareHomepageComponent, ShareDetailComponent, ShareMypushComponent, ShareCheckComponent]
})
export class ShareModule { }
