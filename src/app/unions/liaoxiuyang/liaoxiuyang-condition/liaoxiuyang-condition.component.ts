import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-liaoxiuyang-condition',
  templateUrl: './liaoxiuyang-condition.component.html',
  styleUrls: ['./liaoxiuyang-condition.component.css']
})
export class LiaoxiuyangConditionComponent implements OnInit {

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
