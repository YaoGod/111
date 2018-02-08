import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MsgBasicComponent } from './msg-basic.component';
import { Routes, RouterModule } from '@angular/router';
import { RouteGuardService } from '../../../service/route-guard/route-guard.service';
import { EmptyValueModule } from '../../../pipe/rename/rename.module';
import {ImgurlModule} from "../../../pipe/imgurl/imgurl.module";
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: MsgBasicComponent,
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ImgurlModule,
    RouterModule.forChild(routes),
    EmptyValueModule
  ],
  exports: [RouterModule],
  declarations: [MsgBasicComponent]
})
export class MsgBasicModule { }
