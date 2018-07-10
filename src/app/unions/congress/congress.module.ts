import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CongressComponent } from './congress.component';
import {RouterModule, Routes} from "@angular/router";
import {RouteGuardService} from "../../service/route-guard/route-guard.service";
import {ListComponent} from "./list/list.component";
import {FormsModule} from "@angular/forms";
import {TurnBarModule} from "../../component/turn-bar/turn-bar.module";
import { DetailsComponent } from './details/details.component';
import { CongflowComponent } from './congflow/congflow.component';
import { LaunchComponent } from './launch/launch.component';
import { ApproveComponent } from './approve/approve.component';
import {ProposalReportComponent} from "./proposal-report/proposal-report.component";
import { CongflowDetailComponent } from './congflow-detail/congflow-detail.component';
import {EmptyValueModule} from "../../pipe/rename/rename.module";
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: CongressComponent,
    children: [
      {
        path: '',
        redirectTo: "list",
        pathMatch: 'full'
      },{
        path: 'list',
        component: ListComponent,
      },{
        path: 'info/:id',
        component: DetailsComponent,
      },{
        path: 'congflow',
        component: CongflowComponent,
      },{
        path: 'detail/:id',
        component: CongflowDetailComponent,
      },{
        path: 'approve/:id',
        component: ApproveComponent,
      },{
        path: 'proposalReport',
        component: ProposalReportComponent,
      },{
        path: 'launch',
        component: LaunchComponent,
      }/*,
      {
        path: 'info/:id',
        loadChildren: './reclaim/reclaim.module#ReclaimModule'
      }*/
    ]
  }
];

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    TurnBarModule,
    EmptyValueModule,
    RouterModule.forChild(routes),
  ],
  declarations: [CongressComponent,ListComponent, DetailsComponent, CongflowComponent, LaunchComponent,
    ApproveComponent,ProposalReportComponent, CongflowDetailComponent]
})
export class CongressModule { }
