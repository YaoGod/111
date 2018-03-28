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
import { TurnBarModule } from "../component/turn-bar/turn-bar.module";
import {UserPortalService} from "../service/user-portal/user-portal.service";
import { HelpDocComponent } from './help-doc/help-doc.component';
import {NavTitleModule} from "../component/nav-title/nav-title.module";
import {GlobalFooterModule} from "../component/global-footer/global-footer.module";
@NgModule({
  declarations: [
    HzportalComponent,
    LoginComponent,
    HomepageComponent,
    HeaderComponent,
    HelpDocComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HzportalRoutingModule,
    FormsModule,
    TurnBarModule,
    NavTitleModule,
    GlobalFooterModule,
  ],
  providers: [ GlobalUserService,GlobalCatalogService,ErrorResponseService,IpSettingService,UserPortalService],
  bootstrap: [HzportalComponent]
})
export class HzportalModule { }
