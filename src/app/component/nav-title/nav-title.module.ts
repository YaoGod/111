import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavTitleComponent } from './nav-title.component';
@NgModule({
  imports: [
    CommonModule
  ],
  exports: [ NavTitleComponent ],
  providers: [],
  declarations: [NavTitleComponent]
})
export class NavTitleModule { }
