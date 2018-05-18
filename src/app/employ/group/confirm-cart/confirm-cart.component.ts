import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { GroupCart} from '../../../mode/groupCart/group-cart.service';
import { GroupProductService } from '../../../service/group-product/group-product.service';
import { ErrorResponseService } from '../../../service/error-response/error-response.service';
import { Router } from '@angular/router';
import {GlobalCatalogService} from "app/service/global-catalog/global-catalog.service";
import {IpSettingService} from "app/service/ip-setting/ip-setting.service";

declare var $:any;
declare var confirmFunc: any;

@Component({
  selector: 'app-confirm-cart',
  templateUrl: './confirm-cart.component.html',
  styleUrls: ['./confirm-cart.component.css'],
  providers:[GroupProductService,ErrorResponseService]
})
export class ConfirmCartComponent implements OnInit {

  public cart: GroupCart;
  public num:number;
  public carts:Array<GroupCart>;
  public mutipalPrice:number;
  public username= localStorage.getItem("username");
  public userInfo={
    username: '',
    teleNum: '',
    homeAddr: ''
  };
  constructor(
    private groupProductService: GroupProductService,
    private errorVoid: ErrorResponseService,
    private router: Router,
    private globalCatalogService: GlobalCatalogService,
    public ipSetting: IpSettingService,
  ) {}

  ngOnInit() {
    this.globalCatalogService.setTitle("团购管理/购物车/确认订单");
    this.getCartList();
  }
  getCartList(){
    this.groupProductService.getCartList().subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.carts = data.data.infos;
        for(let i=0;i<this.carts.length;i++){
          if(this.carts[i].imgPath!==null){
            this.carts[i].imgPath = this.carts[i].imgPath.split(';');
          }
        }
        this.mutipalPrice = data.data.mutipalPrice;
        this.userInfo = data.data.userInfo;
        if(this.carts.length===0){
          $(".b-foot").hide();
        }else{
          $(".b-foot").show();
        }
      }
    });
  }

  submitCart(){
    $('.maskSubmitOrder').show();
  }
  public verifyEmpty(id,label) {
    if (!this.isEmpty(id, label)) {
      return false;
    }else{
      return true;
    }
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

  /**  添加错误信息class*/
  private  addErrorClass(id: string, error?: string)  {
    $('#' + id).parents('.form-control').addClass('form-error');
    if (error === undefined || error.trim().length === 0 ) {
      $('#' + id).next('button').next('span').html('输入错误');
    }else {
      $('#' + id).next('button').next('span').html(error);
    }
  }
  /** 去除错误信息class */
  private  removeErrorClass(id: string) {
    $('#' + id).parents('.form-control').removeClass('form-error');
    $('#' + id).parents('.form-control').children('.form-inp').children('.errorMessage').html('');
    $('#' + id).next('button').next('span').html('');
  }

  getcode(){
    let url = '/mmall/laundryOrder/getPayCode/'+this.username;
    this.ipSetting.sendGet(url).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        confirmFunc.init({
          'title': '提示' ,
          'mes': '短信发送成功！',
          'popType': 0 ,
          'imgType': 1 ,
        });
      }
    });

  }
  saveSubmitOrder(){
    if(!this.verifyEmpty('message','短信验证码不能为空')){
      return false;
    }
    this.groupProductService.submitCart($('#message').val(),this.userInfo.homeAddr).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        confirmFunc.init({
          'title': '提示' ,
          'mes': '您的订单提交成功！',
          'popType': 0 ,
          'imgType': 1 ,
        });
        this.getCartList();
        $(".address").hide();
        $(".b-address").hide();
        $('.maskSubmitOrder').hide();
        this.router.navigate(['/hzportal/employ/group']);
      }
    });
  }
  closeSubmitOrder() {
    $('.maskSubmitOrder').hide();
  }
}
