import { Component, OnInit } from '@angular/core';
import { Building } from '../../../mode/building/building.service';
import { InfoBuildingService } from '../../../service/info-building/info-building.service';
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
  providers: [InfoBuildingService]
})
export class HomepageComponent implements OnInit {
  public buildings :Array<Building>;
  private pageNo    :number = 1; /*当前页码*/
  private pageSize  :number = 3; /*显示页数*/
  private search    :string = ''; /*搜索字段*/
  constructor(
    private infoBuildingService:InfoBuildingService
  ) { }

  ngOnInit() {
    this.infoBuildingService.getBuildingList(this.pageNo,this.pageSize,this.search)
      .subscribe(data => {
        this.buildings = data.data.infos;
      });
  }

}
