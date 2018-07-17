import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-liaoxiuyang-sign',
  templateUrl: './liaoxiuyang-sign.component.html',
  styleUrls: ['./liaoxiuyang-sign.component.css']
})
export class LiaoxiuyangSignComponent implements OnInit {

  public pageSize = 10;
  public pageNo = 1;
  public total = 0;
  public searchInfo:any;
  public orders:any;
  constructor() { }

  ngOnInit() {
    this.searchInfoList(1);
  }
  searchInfoList(number){

  }

}
