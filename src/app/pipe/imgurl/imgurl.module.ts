import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImgsafeurlPipe } from './imgsafeurl.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  exports:[ImgsafeurlPipe],
  declarations: [ImgsafeurlPipe]
})
export class ImgurlModule { }
