import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyValuePipe } from './empty-value.pipe';
import { AppendValuePipe } from './append-value.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [ EmptyValuePipe ],
  declarations: [EmptyValuePipe, AppendValuePipe]
})
export class EmptyValueModule { }
