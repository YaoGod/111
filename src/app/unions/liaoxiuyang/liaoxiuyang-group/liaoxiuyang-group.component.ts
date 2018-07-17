import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-liaoxiuyang-group',
  templateUrl: './liaoxiuyang-group.component.html',
  styleUrls: ['./liaoxiuyang-group.component.css']
})
export class LiaoxiuyangGroupComponent implements OnInit {

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
