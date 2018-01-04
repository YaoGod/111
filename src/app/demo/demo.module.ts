import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoComponent } from './demo.component';
import { Routes, RouterModule } from '@angular/router';
import { PrintBarModule } from "../component/print-bar/print-bar.module";
const routes: Routes = [
  {
    path: '',
    component: DemoComponent
  },
];
@NgModule({
  imports: [
    CommonModule,
    PrintBarModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DemoComponent]
})
export class DemoModule { }
