import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ShareComponent } from './share.component';
import {RouteGuardService} from "../../service/route-guard/route-guard.service";
import { ShareHomepageComponent } from './share-homepage/share-homepage.component';
import { ShareDetailComponent } from './share-detail/share-detail.component';
import { ShareMypushComponent } from './share-mypush/share-mypush.component';
import { ShareCheckComponent } from './share-check/share-check.component';
import {FormsModule} from "@angular/forms";
import { ShareNewProductComponent } from './share-new-product/share-new-product.component';
import {ImgurlModule} from "../../pipe/imgurl/imgurl.module";
import {ShareProductPublicService} from "../../service/share-product-public/share-product-public.service";
import {TurnBarModule} from "../../component/turn-bar/turn-bar.module";
import { ShareReserveComponent } from './share-reserve/share-reserve.component';
import { ShareResellComponent } from './share-resell/share-resell.component';
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
      },
      {
        path: "new",
        component: ShareNewProductComponent
      },
      {
        path: "edit/:id",
        component: ShareNewProductComponent
      },
      {
        path: "reserve",
        component: ShareReserveComponent
      },
      {
        path: "resell",
        component: ShareResellComponent
      },
      {
        path: "resell/:id",
        component: ShareResellComponent
      },
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ImgurlModule,
    TurnBarModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers: [ShareProductPublicService],
  declarations: [ShareComponent, ShareHomepageComponent, ShareDetailComponent, ShareMypushComponent,
    ShareCheckComponent, ShareNewProductComponent, ShareReserveComponent, ShareResellComponent]
})
export class ShareModule { }