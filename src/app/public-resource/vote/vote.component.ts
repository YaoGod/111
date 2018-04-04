import { Component, OnInit } from '@angular/core';
import {GlobalCatalogService} from "../../service/global-catalog/global-catalog.service";

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit {

  constructor(
    private globalCatalogService: GlobalCatalogService
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("公共资源/投票管理");
  }
}
