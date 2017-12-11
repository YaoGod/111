import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentComponent } from './content/content.component';
import { OrdersComponent } from './orders/orders.component';
import { OrdersReportComponent } from './orders-report/orders-report.component';
import { RouteGuardService } from '../../../service/route-guard/route-guard.service';
import { Routes, RouterModule } from '@angular/router';
import { PropertyServiceComponent } from './property-service.component';
const routes: Routes = [
  {
    path: '',
    component: PropertyServiceComponent,
    children: [
      {
        path: '',
        canActivate: [RouteGuardService],
        redirectTo: 'content',
        pathMatch: 'full'
      },
      {
        path: 'content',
        component: ContentComponent,
      },
      {
        path: 'orders',
        component: OrdersComponent,
      },
      {
        path: 'ordersReport',
        component: OrdersReportComponent,
      },
      {
        path: '**',
        redirectTo: 'content',
        pathMatch: 'full'
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  declarations: [ContentComponent, OrdersComponent, OrdersReportComponent, PropertyServiceComponent]
})
export class PropertyServiceModule { }
