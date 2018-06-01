import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExportDetailComponent } from './export-detail.component';
import {FormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";
import {RouteGuardService} from "../../service/route-guard/route-guard.service";
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: ExportDetailComponent,
  },
  {
    path: ':id',
    canActivate: [RouteGuardService],
    component: ExportDetailComponent,
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [ExportDetailComponent]
})
export class ExportDetailModule { }
