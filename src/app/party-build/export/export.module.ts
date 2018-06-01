import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExportComponent } from './export.component';
import {RouterModule, Routes} from "@angular/router";
import {RouteGuardService} from "../../service/route-guard/route-guard.service";
import {ExportReportComponent} from "./export-report/export-report.component";
import { ExportCountComponent } from './export-count/export-count.component';
import {GlobalFooterModule} from "../../component/global-footer/global-footer.module";
import {TurnBarModule} from "../../component/turn-bar/turn-bar.module";
import {FormsModule} from "@angular/forms";

const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: ExportComponent,
    children: [
      {
        path: "",
        redirectTo:'report',
        pathMatch:'full'
      },
      {
        path: "report",
        component:ExportReportComponent
      },
      {
        /*统计报表*/
        path: "count",
        component:ExportCountComponent
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GlobalFooterModule,
    TurnBarModule,
    RouterModule.forChild(routes),
  ],
  declarations: [ExportComponent,ExportReportComponent, ExportCountComponent]
})
export class ExportModule { }
