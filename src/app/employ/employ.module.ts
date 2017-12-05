import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployRoutingModule } from './employ-routing.module';
import { NavTitleModule } from '../component/nav-title/nav-title.module';
@NgModule({
  imports: [
    CommonModule,
    EmployRoutingModule,
    NavTitleModule
  ],
  declarations: []
})
export class EmployModule { }
