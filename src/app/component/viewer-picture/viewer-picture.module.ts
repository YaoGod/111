import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewerPictureComponent } from './viewer-picture.component';
@NgModule({
  imports: [
    CommonModule
  ],
  exports:[ViewerPictureComponent],
  declarations: [ViewerPictureComponent]
})
export class ViewerPictureModule { }
