import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DetailDossierComponent } from './detail-dossier.component';
import { Routes, RouterModule } from '@angular/router';
import { RouteGuardService } from '../../../service/route-guard/route-guard.service';
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: DetailDossierComponent,
  }
];
@NgModule({
    imports: [
    CommonModule,
      FormsModule,
      RouterModule.forChild(routes)
    ],
  exports: [RouterModule],
  declarations: [DetailDossierComponent]
})
export class DetailDossierModule { }
