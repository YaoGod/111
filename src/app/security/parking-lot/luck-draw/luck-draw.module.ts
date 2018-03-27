import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LuckDrawComponent } from './luck-draw.component';
import {RouterModule, Routes} from "@angular/router";
import {RouteGuardService} from "../../../service/route-guard/route-guard.service";

const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: LuckDrawComponent,
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LuckDrawComponent]
})
export class LuckDrawModule { }