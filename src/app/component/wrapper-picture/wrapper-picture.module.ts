import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapperPictureComponent } from './wrapper-picture.component';
import { RouterModule } from "@angular/router";

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [WrapperPictureComponent],
  declarations: [WrapperPictureComponent]
})
export class WrapperPictureModule { }
