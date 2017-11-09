import { Component, OnInit } from '@angular/core';
import { InfoBuildingService } from '../../../service/info-building/info-building.service';
@Component({
  selector: 'app-building',
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.css'],
  providers: [InfoBuildingService]
})
export class BuildingComponent implements OnInit {
  private building;
  constructor(
    private infoBuildingService:InfoBuildingService
  ) { }

  ngOnInit() {
    this.infoBuildingService.getBuildingMsg(5)
      .subscribe(data => {
        this.building = data.data.infos;
      });
  }

}
