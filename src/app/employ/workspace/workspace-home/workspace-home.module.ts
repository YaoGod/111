import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceHomeComponent } from './workspace-home.component';
import {RouterModule, Routes} from "@angular/router";
import {FormsModule} from "@angular/forms";
const routes: Routes = [
  {
    path: '',
    component: WorkspaceHomeComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [WorkspaceHomeComponent]
})
export class WorkspaceHomeModule { }
