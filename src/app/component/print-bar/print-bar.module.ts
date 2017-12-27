import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintBarComponent } from './print-bar.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports:[PrintBarComponent],
  declarations: [PrintBarComponent]
})
export class PrintBarModule { }
