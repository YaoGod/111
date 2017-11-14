import { Component, OnInit } from '@angular/core';

declare var AMap: any;
@Component({
  selector: 'app-repair',
  templateUrl: './repair.component.html',
  styleUrls: ['./repair.component.css']
})
export class RepairComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // this.showMap();
  }
  // 获取大楼维修记录  /building/repair/getRepairList/{id}/{pageNo}/{pageSize

  // 地图
  showMap() {
    let map = new AMap.Map('gaodemap-container', {
      resizeEnable: true,
      center: [120.158703, 30.274118],
      zoom: 18
    });
    map.plugin('AMap.Geolocation', () => {
      let geolocation = new AMap.Geolocation({
      });
      map.addControl(geolocation);
    });

    map.plugin(["AMap.Scale"], function () {
      var scale = new AMap.Scale();
      map.addControl(scale);
    });

  }
}
