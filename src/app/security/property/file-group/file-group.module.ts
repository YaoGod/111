import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { RouteGuardService } from '../../../service/route-guard/route-guard.service';
import { FileGroupComponent } from './file-group.component';
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: FileGroupComponent,
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: [FileGroupComponent]
})
export class FileGroupModule { }
