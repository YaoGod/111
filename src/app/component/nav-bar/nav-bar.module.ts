import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar.component';
import { Router } from '@angular/router';
import { sndCatalog } from '../../mode/catalog/catalog.service';
@NgModule({
  imports: [
    CommonModule
  ],
  exports: [NavBarComponent],
  providers: [sndCatalog],
  declarations: [NavBarComponent]
})
export class NavBarModule {}
