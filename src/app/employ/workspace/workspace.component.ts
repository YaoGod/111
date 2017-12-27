import { Component, OnInit } from '@angular/core';
import { GlobalCatalogService } from '../../service/global-catalog/global-catalog.service';
import {Catalog} from "../../mode/catalog/catalog.service";
@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit {

  public navs : Array<Catalog>;

  constructor(
    private globalCatalogService: GlobalCatalogService
  ) { }

  ngOnInit() {
    /*this.navs = new Array<Catalog>(2);*/
    this.globalCatalogService.setTitle("员工服务/我的工作台");
    /*let name = ['消费查询','订单处理','服务中心'];
    for(let i = 0;i < name.length; i++){
      this.navs[i] = new Catalog();
      this.navs[i].name = name[i];
    }
    let childName = ['消费账户及记录查询','洗衣账户及记录查询'];
    let childPath = ['consAccount','washAccount'];
    this.navs[0].childs = new Array<Catalog>(childName.length);
    for(let i = 0;i<childName.length;i++){
      this.navs[0].childs[i] = new Catalog();
      this.navs[0].childs[i].name = childName[i];
      this.navs[0].childs[i].routeUrl = childPath[i];
    }*/
  }

}
