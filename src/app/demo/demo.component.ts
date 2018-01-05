import {Component, OnInit, EventEmitter} from '@angular/core';
@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {

  public title:string;
  public formData:any;
  constructor() { }

  ngOnInit() {
    this.title = "发货清单";
    this.formData = [
      {
        title:"",
        type:"bold",
        hd:["系统订单号"],
        data:["44556234123213"]
      },
      {
        title:"",
        type:"text",
        hd:["付款时间"],
        data:["2017/12/22 12:45:23"]
      },
      {
        title:"收货人信息",
        type:"text",
        hd:["收货人姓名","收货人电话"],
        data:["Bob","13868656955"]
      },
      {
        title:"商品明细",
        type:"form",
        hd:["商品编码","商品名称","规格","单位","单价","金额","折后价"],
        data:[
          ["AB034036","INBIKB 塑料水壶架","","1","8.80","8.80","8.80"],
          ["AB034036","INBIKB 塑料水壶架","","1","8.80","8.80","8.80"]
        ]
      }
    ]
  }
}
