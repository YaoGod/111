import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubunitlistComponent } from './subunitlist.component';
import {FormsModule} from "@angular/forms";
import {TurnBarModule} from "../../../component/turn-bar/turn-bar.module";
import {RouterModule, Routes} from "@angular/router";
import {RouteGuardService} from "../../../service/route-guard/route-guard.service";
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: SubunitlistComponent,
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TurnBarModule,
    RouterModule.forChild(routes),
  ],
  declarations: [SubunitlistComponent]
})
export class SubunitlistModule { }
