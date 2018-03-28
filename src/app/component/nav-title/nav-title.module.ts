import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavTitleComponent } from './nav-title.component';
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [ NavTitleComponent ],
  providers: [],
  declarations: [NavTitleComponent]
})
export class NavTitleModule { }
