import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HzportalRoutingModule } from './hzportal-routing.module';


import { HzportalComponent } from './hzportal.component';
import { LoginComponent } from './login/login.component';
import { HomepageComponent } from './homepage/homepage.component';
import { HeaderComponent } from './header/header.component';
@NgModule({
  declarations: [
    HzportalComponent,
    LoginComponent,
    HomepageComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HzportalRoutingModule,
  ],
  providers: [],
  bootstrap: [HzportalComponent]
})
export class HzportalModule { }
