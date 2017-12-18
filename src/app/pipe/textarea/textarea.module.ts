import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatSpacePipe } from './format-space.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [FormatSpacePipe],
  declarations: [FormatSpacePipe]
})
export class TextareaModule { }
