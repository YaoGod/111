import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HzportalRoutingModule } from './hzportal-routing.module';
import { HzportalComponent } from './hzportal.component';
import { LoginComponent } from './login/login.component';
import { HomepageComponent } from './homepage/homepage.component';
import { HeaderComponent } from './header/header.component';
import { ErrorResponseService } from '../service/error-response/error-response.service';
import { GlobalUserService } from '../service/global-user/global-user.service';
import { FormsModule } from "@angular/forms";
import { GlobalCatalogService } from "../service/global-catalog/global-catalog.service";
import { IpSettingService } from "../service/ip-setting/ip-setting.service";
@NgModule({
  declarations: [
    HzportalComponent,
    LoginComponent,
    HomepageComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HzportalRoutingModule,
    FormsModule
  ],
  providers: [ GlobalUserService,GlobalCatalogService,ErrorResponseService,IpSettingService],
  bootstrap: [HzportalComponent]
})
export class HzportalModule { }
