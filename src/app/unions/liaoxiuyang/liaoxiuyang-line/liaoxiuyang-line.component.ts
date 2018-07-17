import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-liaoxiuyang-line',
  templateUrl: './liaoxiuyang-line.component.html',
  styleUrls: ['./liaoxiuyang-line.component.css']
})
export class LiaoxiuyangLineComponent implements OnInit {

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
