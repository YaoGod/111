import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { GroupOrderService } from '../../../service/group-order/group-order.service';
import {GroupMessage, GroupOrder} from '../../../mode/groupOrder/group-order.service';
import {GroupOrderItem} from '../../../mode/groupOrderItem/group-orderItem.service'
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
import {GroupProductService} from "../../../service/group-product/group-product.service";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {ActivatedRoute,Params} from "@angular/router";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
declare var $:any;
declare var confirmFunc: any;

@Component({
  selector: 'app-order',
  templateUrl: './myorder.component.html',
  styleUrls: ['./myorder.component.css'],
  providers:[GroupOrderService,ErrorResponseService,GroupProductService]
})
export class MyorderComponent implements OnInit {
  public search: GroupOrder;
  public message:GroupMessage;
  public pageSize = 5;
  public pageNo = 1;
  public total = 0;
  public length = 5;
  public cartsize:number;
  public orders:Array<GroupOrder>;
  public orderItems:Array<GroupOrderItem>;
  public  newMessage={
    orderNo:'',
    content:''
  };
  public viewMessage={
    orderNo:'',
    content:'',
    reply:'',
    replyTime:'',
    replyUser:'',
    insterTime:''
  };
  public chooseId;
  constructor(
    private route: ActivatedRoute,
    private groupOrderService: GroupOrderService,
    private groupProductService: GroupProductService,
    private errorVoid: ErrorResponseService,
    public ipSetting  : IpSettingService) { }

  ngOnInit() {
    this.search = new GroupOrder();
    this.chooseId = "";
    this.getProductShowList();
    if(typeof (this.route.params['_value']['id']) === "undefined"){
      this.getOrderList(1,this.chooseId);
    }else{
      let tempid = 0;
      this.route.params
        .switchMap((params: Params) => this.chooseId = params['id'])
        .subscribe(() => {
          if (tempid === 0) {
            this.getOrderList(1,this.chooseId);
            tempid++;
          }
        });
    }
  }

  getOrderList(i,chooseId){
    this.pageNo = i;
      let url = '/mmall/order/getOrderList/'+this.pageNo+'/'+this.pageSize+"?id="+chooseId;
      this.ipSetting.sendGet(url).subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          this.orders = data.data.infos;
          for(let i=0;i<this.orders.length;i++){
            for(let j=0;j<this.orders[i].groupOrderItems.length;j++){
              this.orders[i].groupOrderItems[j].imgPath = this.orders[i].groupOrderItems[j].imgPath.split(';');
            }
          }

          this.total = data.data.total;
        }
      });
  }
  getProductShowList(){
    this.groupProductService.getProductShowList(this.pageNo,this.pageSize,this.search).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.cartsize = data.data.cartsize;

      }
    });
  }
  public verifyEmpty(id,label) {
    if (!this.isEmpty(id, label)) {
      return false;
    }else{
      return true;
    }
  }
/*评价提交*/
  submitMessage() {
    if (!this.verifyEmpty('content','评价意见不能为空')){
      return false;
    }
    this.groupOrderService.addMessage(this.newMessage)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          confirmFunc.init({
            'title': '提示' ,
            'mes': data['msg'],
            'popType': 0 ,
            'imgType': 1 ,
          });
          this.closeMask0();
          this.getOrderList(1,this.chooseId);
        }
      })
  }

  closeMask0() { $('.errorMessage').html('');
    $('.mask0').hide();
    this.newMessage={
      orderNo:'',
      content:''
    };
  }
  closeMask1() {
    $('.errorMessage').html('');
    $('.mask1').hide();
    this.viewMessage={
      orderNo:'',
      content:'',
      reply:'',
      replyTime:'',
      replyUser:'',
      insterTime:''
    }
  }


  addMessage(orderId){
    this.newMessage.orderNo =orderId;
    $('.mask0').show();
  }
  showMessage(orderId){
    $('.mask1').show();
    this.groupOrderService.getMessage(orderId)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          this.viewMessage = data.data;
        }
      })
  }

  /**非空校验*/
  private isEmpty(id: string, error: string): boolean  {
    const data =  $('#' + id).val();
    if (data==null||data===''||data.trim() === '')  {
      this.addErrorClass(id, error);
      return false;
    }else {
      this.removeErrorClass(id);
      return true;
    }
  }
  /**
   * 添加错误信息class
   * @param id
   * @param error
   */
  private  addErrorClass(id: string, error?: string)  {
    $('#' + id).parents('.form-control').addClass('form-error');
    if (error === undefined || error.trim().length === 0 ) {
      $('#' + id).next('span').html('输入错误');
    }else {
      $('#' + id).next('span').html(error);
    }
  }
  /**
   * 去除错误信息class
   * @param id
   */
  private  removeErrorClass(id: string) {
    $('#' + id).parents('.form-control').removeClass('form-error');
    $('#' + id).parents('.form-control').children('.form-inp').children('.errorMessage').html('');
    $('#' + id).next('span').html('');
  }
}

