import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CasedetailComponent } from './casedetail/casedetail.component';
import {RouterModule, Routes} from "@angular/router";
import {RouteGuardService} from "../../service/route-guard/route-guard.service";
import {FormsModule} from "@angular/forms";
import {PracticeCasesComponent} from "./practice-cases.component";

const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: PracticeCasesComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        loadChildren: './caselist/caselist.module#CaselistModule'
      },
      {
        path: 'detail/:id',
        component: CasedetailComponent
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [CasedetailComponent, PracticeCasesComponent]
})
export class PracticeCasesModule { }
