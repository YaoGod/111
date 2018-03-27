import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../service/global-catalog/global-catalog.service";
import {User} from "../../mode/user/user.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  public pageNo;
  public pageSize = 10;
  public total = 0;
  public search: User;
  public users: Array<User>;
  constructor(
    private globalCatalogService: GlobalCatalogService
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("系统管理/用户管理");
    this.search = new User();
    this.users = [];
  }

  getUserList(pageNo){

  }
}
