import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypeDefineComponent } from './type-define.component';
import { Routes, RouterModule } from '@angular/router';
import { RouteGuardService } from '../../../service/route-guard/route-guard.service';
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: TypeDefineComponent,
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: [TypeDefineComponent]
})
export class TypeDefineModule { }