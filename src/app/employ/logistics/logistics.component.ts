import { Component, OnInit } from '@angular/core';
import { GlobalCatalogService } from '../../service/global-catalog/global-catalog.service';
import {Catalog, sndCatalog} from '../../mode/catalog/catalog.service';
@Component({
  selector: 'app-logistics',
  templateUrl: './logistics.component.html',
  styleUrls: ['./logistics.component.css']
})
export class LogisticsComponent implements OnInit {

  public navs : Array<Catalog>;
  constructor(
    private globalCatalogService: GlobalCatalogService,
  ) { }

  ngOnInit() {
    this.navs = new Array<Catalog>(2);
    this.globalCatalogService.setTitle("员工服务/后勤服务区");
    let name = ['洗衣服务区','物业服务区'];
    for(let i = 0;i < name.length; i++){
      this.navs[i] = new Catalog();
      this.navs[i].name = name[i];
    }
    let childName = ['服务商管理','服务价格内容管理','预定洗衣服务管理','预定洗衣服务报表查询'];
    let childPath = ['facilitator','price','planLaundry','PlanReport'];
    this.navs[0].childs = new Array<Catalog>(childName.length);
    for(let i = 0;i<childName.length;i++){
      this.navs[0].childs[i] = new Catalog();
      this.navs[0].childs[i].name = childName[i];
      this.navs[0].childs[i].routeUrl = childPath[i];
    }
    childName = ['物业服务内容管理','物业订单管理','物业订单的查询报表'];
    childPath = ['facilitator','orders','ordersReport'];
    this.navs[1].childs = new Array<Catalog>(childName.length);
    for(let i = 0;i<childName.length;i++){
      this.navs[1].childs[i] = new Catalog();
      this.navs[1].childs[i].name = childName[i];
      this.navs[1].childs[i].routeUrl = childPath[i];
    }
  }

}
