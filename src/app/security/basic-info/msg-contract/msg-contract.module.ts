import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MsgContractComponent } from './msg-contract.component';
import { Routes, RouterModule } from '@angular/router';
import { RouteGuardService } from '../../../service/route-guard/route-guard.service';
import { TranTypePipe } from '../../../pipe/transfer/tran-type.pipe';
import {TurnBarModule} from "../../../component/turn-bar/turn-bar.module";
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: MsgContractComponent,
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TurnBarModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: [MsgContractComponent, TranTypePipe]
})
export class MsgContractModule { }
