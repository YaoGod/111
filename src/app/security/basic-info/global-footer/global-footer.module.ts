import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalFooterComponent } from '../global-footer/global-footer.component';
@NgModule({
  imports: [
    CommonModule
  ],
  exports: [GlobalFooterComponent],
  declarations: [GlobalFooterComponent]
})
export class GlobalFooterModule { }
