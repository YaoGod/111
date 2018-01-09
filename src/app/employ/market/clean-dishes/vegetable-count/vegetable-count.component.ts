import { Component, OnInit } from '@angular/core';
declare var confirmFunc:any;
import * as $ from 'jquery';
@Component({
  selector: 'app-vegetable-count',
  templateUrl: './vegetable-count.component.html',
  styleUrls: ['./vegetable-count.component.css']
})
export class VegetableCountComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  export(){
    confirmFunc.init({
      'title': '提示',
      'mes': '是否导出数据',
      'popType': 1,
      'imgType': 3,
      'callback': ()=>{

      }
    });
  }

}
