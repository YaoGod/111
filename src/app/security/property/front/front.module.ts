import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FrontComponent } from './front.component';
import { Routes, RouterModule } from '@angular/router';
import { RouteGuardService } from '../../../service/route-guard/route-guard.service';
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: FrontComponent,
    children: [
       {
       path:'',
       redirectTo:'account/0/0',
       pathMatch:'full'
       },
      {
        path:'account/:classID/:buildingID',
        loadChildren:'../account/account.module#AccountModule'
      },
      {
        path:'account/:classID/:buildingID/:group',
        loadChildren:'../group-list/group-list.module#GroupListModule'
      },
      {
        path:'file/:classID/:buildingID',
        loadChildren:'../file/file.module#FileModule'
      },
      {
        path:'file/:classID/:buildingID/:group',
        loadChildren:'../file-group/file-group.module#FileGroupModule'
      },
      {
        path:'dossier/:dossierId',
        loadChildren: '../detail-dossier/detail-dossier.module#DetailDossierModule'
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: [FrontComponent]
})
export class FrontModule { }
