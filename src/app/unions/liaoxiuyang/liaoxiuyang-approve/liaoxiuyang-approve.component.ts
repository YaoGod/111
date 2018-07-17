import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-liaoxiuyang-approve',
  templateUrl: './liaoxiuyang-approve.component.html',
  styleUrls: ['./liaoxiuyang-approve.component.css']
})
export class LiaoxiuyangApproveComponent implements OnInit {

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
