import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
declare var $: any;
declare var confirmFunc: any;
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {IpSettingService} from "app/service/ip-setting/ip-setting.service";

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.css'],
  providers: [ErrorResponseService]
})
export class PriceComponent implements OnInit {
  public products:Array<FacPrice>;
  public applierList:Array<Facilitator>;
  public search: FacPrice;
  public days:string;
  private code: any;
  private pageNo = 1;
  /*当前页码*/
  private pageSize =5;
  public pages: Array<number>;
  public  productAdd={
    priceId:   '',
    applyid:          '',
    appcotent:        '',
    unit:              '',
    price:             '',
    appliar:''
  };
  public  productUp= {
    priceId:   '',
    applyid:     '',
    appcotent:     '',
    unit:           '',
    price:          '',
    appliar:''
  }
  constructor(private ipSetting: IpSettingService,private errorVoid: ErrorResponseService) { }

  ngOnInit() {
    this.search = new FacPrice();
    this.pages = [];
    this.getFacList();
  }
  getFacList(){
    let url = '/mmall/laundry/getFacList/'+this.pageNo + '/' + this.pageSize;
    this.ipSetting.sendPost(url,this.search)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          this.products = data.data.infos;
          this.applierList = data.data.applierList;
          console.log(data.data);
          let total = Math.ceil(data.data.total / this.pageSize);
          this.initPage(total);
        }
      });
  }
  /*删除*/
  okFunc() {
    $('.confirm').hide();
    let url = "/mmall/laundry/deletetProduct/"+this.code;
    this.ipSetting.sendGet(url).subscribe(data => {
      if (this.errorVoid.errorMsg(data.status)) {
        alert("删除成功");
      }
      this.getFacList();
    });
  }

  addProduct() {
    if(!this.verifyEmpty("appcotent_add","服务内容不能为空")){
      return false;
    }
    if(!this.verifyEmpty("price_add","价格不能为空")){
      return false;
    }
    if(this.checkPrice("price_add")){
      return false;
    }
    if(!this.verifyEmpty("unit_add","单位不能为空")){
      return false;
    }
    if(!this.verifyEmpty("supplierId_add","服务商不能为空")){
      return false;
    }
    console.log(this.productAdd);
    let url = "/mmall/laundry/addFacPrice";
    this.ipSetting.sendPost(url,this.productAdd).subscribe(data => {
      if(data['status'] === 0){
        alert(data['data']);
        this.closeMaskAdd();
        this.getFacList();
      }else{
        alert(data['msg']);
      }
    })
  }

  /**非空校验*/
  private isEmpty(id: string, error: string): boolean  {
    const data =  $('#' + id).val();
    if (data==null||data==''||data.trim() == '')  {
      this.addErrorClass(id, error);
      return false;
    }else {
      this.removeErrorClass(id);
      return true;
    }
  }

  private checkPrice(id){
    let reg =/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
    if(!reg.test($('#' + id).val())){
      this.addErrorClass(id, "请输入正确的价格");
      return true;
    }
  }

  private verifyEmpty(id,label) {
    if (!this.isEmpty(id, label)) {
      return false;
    }else{
      return true;
    }
  }
  /*修改*/
  updateProduct() {
    if(!this.verifyEmpty("appcotent_edit","服务内容不能为空")){
      return false;
    }
    if(!this.verifyEmpty("price_edit","价格不能为空")){
      return false;
    }
    if(this.checkPrice("price_edit")){
      return false;
    }
    if(!this.verifyEmpty("unit_edit","单位不能为空")){
      return false;
    }
    if(!this.verifyEmpty("supplierId_edit","服务商不能为空")){
      return false;
    }
    let url = "/mmall/laundry/updateProduct";
    this.ipSetting.sendPost(url,this.productUp).subscribe(data => {
      console.log(data);
      if(data['status'] === 0){
        alert(data['data']);
        this.closeMaskUp();
        this.getFacList();
      }else{
        alert(data['msg']);
        this.closeMaskUp();
      }
    })
  }

  /*修改*/
  update(code: string) {
    let url = "/mmall/laundry/geFacDetail/"+code;
    this.ipSetting.sendGet(url).subscribe(data => {
      if(data['status']==0){
        this.productUp = data.data;
      }
      $('.maskUpdate').show();
    });
  }

  closeMaskUp() {
    $('.maskUpdate').hide();
    this.productUp={
      priceId:   '',
      applyid:          '',
      appcotent:        '',
      unit:              '',
      price:             '',
      appliar: ''
    };
  }

  delete(code: number) {
    this.code = code;
    $('.confirm').fadeIn();
  }

  noFunc() {
    $('.confirm').fadeOut();
  }
  add() {
    $('.maskAdd').show();
  }
  closeMaskAdd() {
    $('.maskAdd').hide();
    this.productAdd={
      priceId:   '',
      applyid:          '',
      appcotent:        '',
      unit:              '',
      price:             '',
      appliar:''
    };
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
  /*页码初始化*/
  initPage(total){
    this.pages = new Array(total);
    for(let i = 0;i< total ;i++){
      this.pages[i] = i+1;
    }
  }
  /*页面显示区间5页*/
  pageLimit(page:number){
    if(this.pages.length < 5){
      return false;
    } else if(page<=5 && this.pageNo <= 3){
      return false;
    } else if(page>=this.pages.length -4 && this.pageNo>=this.pages.length-2){
      return false;
    } else if (page<=this.pageNo+2 && page>=this.pageNo-2){
      return false;
    }
    return true;
  }
  /*跳页加载数据*/
  goPage(page:number){
    this.pageNo = page;
    if(this.search==null){
      this.search = new FacPrice();
    }
    this.getFacList();
  }

}

export class FacPrice {
  priceId;    number;
  applyid:          string;
  appcotent:        string;
  unit:              string;
  price:             number;
  appliar:           string;
}
export class Facilitator {
  applyId:          string;/*经销商id*/
  applyName:        string;/*经销商名称*/
  copStarttime:     string;/*合作开始时间*/
  copEndtime:       string;/*合作结束时间*/
  applyDesc:        string;/*描述*/
}
