import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogisticsComponent } from './logistics.component';
import { RouteGuardService } from '../../service/route-guard/route-guard.service';
import { Routes, RouterModule } from '@angular/router';
import { NavBarModule } from '../../component/nav-bar/nav-bar.module';
import {} from './laundry/laundry.module'
const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
    component: LogisticsComponent,
    children: [
      {
        path: '',
        redirectTo: 'laundry',
        pathMatch: 'full'
      },
      {
        path: 'laundry',
        loadChildren: './laundry/laundry.module#LaundryModule'
},
      {
        path: 'property',
        loadChildren: './property-service/property-service.module#PropertyServiceModule'
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    NavBarModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  declarations: [LogisticsComponent]
})
export class LogisticsModule { }
