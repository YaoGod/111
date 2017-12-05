import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavTitleComponent } from './nav-title.component';
@NgModule({
  imports: [
    CommonModule
  ],
  exports: [ NavTitleComponent ],
  declarations: [NavTitleComponent]
})
export class NavTitleModule { }
