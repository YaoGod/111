import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermitComponent } from './permit.component';
import {RouterModule, Routes} from "@angular/router";
import {RouteGuardService} from "../../../service/route-guard/route-guard.service";
import {TurnBarModule} from "../../../component/turn-bar/turn-bar.module";
import {ImgurlModule} from "../../../pipe/imgurl/imgurl.module";
import {FormsModule} from "@angular/forms";
import { PaperComponent } from './paper/paper.component';
import { OverdueComponent } from './overdue/overdue.component';
import { PaperinfoComponent } from './paperinfo/paperinfo.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: PermitComponent,
    children: [
      {
        path: '',
        redirectTo: "paper",
        pathMatch: 'full'
      },
      {
        path: 'paper',
        component: PaperComponent,
      },
      {
        path: 'overdue',
        component: OverdueComponent
      },
      {
        path: 'paperinfo/:id',
        component: PaperinfoComponent
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TurnBarModule,
    ImgurlModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PermitComponent, PaperComponent, OverdueComponent, PaperinfoComponent]
})

export class PermitModule { }
