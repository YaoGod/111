import {Component, EventEmitter, Input, OnInit, OnChanges, Output} from '@angular/core';

@Component({
  selector: 'app-turn-bar',
  templateUrl: './turn-bar.component.html',
  styleUrls: ['./turn-bar.component.css']
})
export class TurnBarComponent implements OnChanges {

  @Input ()  pageNo    : number;   /*当前页码*/
  @Input ()  pageSize  : number;   /*页面显示条数*/
  @Input ()  total     : number;   /*总共数据条数*/
  @Input ()  length    : number;   /*页码显示页数*/
  @Output()  turnEvent : EventEmitter<any>  = new EventEmitter<any>();

  public pages: Array<number> = [];
  public abc: number;

  constructor() { }

  ngOnChanges() {
    if(typeof (this.pageNo)==="undefined"||this.pageNo === null){
      this.pageNo = 1;
    }
    if(typeof (this.pageSize)==="undefined"||this.pageSize === null){
      this.pageNo = 10;
    }
    if(typeof (this.total)==="undefined"||this.total === null){
      this.total = 0;
    }
    if(typeof (this.length)==="undefined"||this.length === null || this.length<2){
      this.length = 5;
    }
    this.initPage();
  }
  /*页码初始化*/
  initPage(){
    let pageLength = Math.ceil(this.total / this.pageSize);
    this.abc = pageLength;
    this.pages = new Array(pageLength);
    for(let i = 0;i< pageLength ;i++){
      this.pages[i] = i+1;
    }
  }
  /*页面显示区间5页*/
  pageLimit(page:number){
    if(this.pages.length < this.length){
      /*页码过少,不需要折叠*/
      return false;
    }else{
      if(this.pageNo <= this.length/2){
        /*当前页码在前部分，显示1-length*/
        if(page>this.length){
          return true;
        }
      }else if(this.pageNo>=this.length/2&&this.pageNo<=this.pages.length-this.length/2){
        /*当前页码处于中间*/
        if(page<=this.pageNo-this.length/2 || page>this.pageNo+this.length/2){
          return true;
        }
      }else{
        /*当前页码处于最后*/
        if(page<=this.pages.length-this.length){
          return true;
        }
      }
      return false;
    }
  }
  /*跳页加载数据*/
  goPage(page:number){
    this.pageNo = page;
    this.turn(page);
  }
  turn(pageNo:number){
    this.turnEvent.emit(pageNo);
  }
}
