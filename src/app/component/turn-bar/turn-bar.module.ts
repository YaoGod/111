import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TurnBarComponent } from './turn-bar.component';
import {FormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [TurnBarComponent],
  declarations: [TurnBarComponent]
})
export class TurnBarModule {
  /*页面翻页功能*/
}
