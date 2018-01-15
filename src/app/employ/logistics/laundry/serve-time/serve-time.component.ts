import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
declare var $: any;
declare var confirmFunc: any;
import {ErrorResponseService} from "../../../../service/error-response/error-response.service";
import {IpSettingService} from "app/service/ip-setting/ip-setting.service";

@Component({
  selector: 'app-serve-time',
  templateUrl: './serve-time.component.html',
  styleUrls: ['./serve-time.component.css'],
  providers: [ErrorResponseService]
})
export class ServeTimeComponent implements OnInit {
  public products:any;
  public addSwitch: Boolean = true;
  public pageSize = 5;
  public pageNo = 1;
  public total = 0;
  public length = 5;
  public pages: Array<number>;
  public serverCenters:Array<ServerCenter>;
  public search: FacPrice;
  public applierList:Array<Facilitator>;
  public productAdd:ServeTime;
  public serveChat: string;
  constructor(private ipSetting: IpSettingService,private errorVoid: ErrorResponseService) { }

  ngOnInit() {
    this.pages = [];
    this.productAdd = new ServeTime();
    this.search = new FacPrice();
    this.getFacList();
    this.getServiceCenter();

  }
  /*获取所有服务商*/
  getFacList(){
    let url = '/mmall/laundry/getFacList/'+this.pageNo + '/' + this.pageSize;
    this.ipSetting.sendPost(url,this.search)
      .subscribe(data => {
        if (this.errorVoid.errorMsg(data)) {
          this.applierList = data.data.applierList;
          // console.log(this.applierList);
          this.serveChat = this.applierList[0].applyId;
          this.getCenterTime();
        }
      });
  }
  /*获取所有服务中心*/
  getServiceCenter(){
    let url = '/employee/serviceCenter/getServiceCenter';
    this.ipSetting.sendGet(url).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.serverCenters = data.data;
        // console.log(data.data);
      }
    });
  }
  /*获取所有服务中心时间*/ // /mmall/laundry/getproviderTime/{id}/{centerId}/{day}/{time}
  getCenterTime(){
    let url = '/mmall/laundry/getproviderTime/'+this.serveChat+'/all/all/all';
    this.ipSetting.sendGet(url).subscribe(data => {
      if (this.errorVoid.errorMsg(data)) {
        this.products = data.data;
        // console.log(this.products);
      }
    });
  }
  facChange(){
    this.getCenterTime();
  }
  /*点击新增*/
  add() {
    this.addSwitch = true;
    this.productAdd = new ServeTime();
    $('.maskAdd').show();
    $('.modal-title').html('新增服务时间');
    $('#servePlace,#serveChat').attr('disabled',false);
  }
  /*点击修改*/ // GET /mmall/laundry/getproviderTime/{id}/{day}/{time}
  update(code: number,name:string,index) {
    this.addSwitch = false;
    this.productAdd.facilitatorId = this.serveChat;
    this.productAdd.centerId = this.products[index].center.id;
    $('.maskAdd').show();
    $('.modal-title').html('编辑服务时间');
    $('#servePlace,#serveChat').attr('disabled',true);
  }
  /*新增/编辑服务内容提交*/
  addProduct() {
    let url = "/mmall/laundry/addproviderTime";
    /*if(this.addSwitch){url = "/mmall/laundry/addFacPrice";}else{url = "/mmall/laundry/updateProduct";}*/
    if(!this.verifyEmpty("servePlace","服务中心不能为空")||!this.verifyEmpty("serveDate","服务时间不能为空")||
      !this.verifyEmpty("bTime_add","开始时间不能为空")||!this.verifyEmpty("eTime_add","结束时间不能为空")){
      return false;
    }
    this.productAdd.time ='all';
    this.ipSetting.sendPost(url,this.productAdd).subscribe(data => {
      // console.log(data['msg']);
      if (this.errorVoid.errorMsg(data)) {
        confirmFunc.init({
          'title': '提示' ,
          'mes': this.addSwitch === false?'更改成功':'新增成功',
          'popType': 0 ,
          'imgType': 1 ,
        });
        this.closeMaskAdd();
        this.getCenterTime();
      }
    })
  }
  /*新增的取消*/
  closeMaskAdd(){
    this.productAdd = new ServeTime();
    $('.form-control').removeClass('form-error');
    $('.form-control span').html('');
    $('.maskAdd').hide();
  }
  /**非空校验*/
  private isEmpty(id: string, error: string): boolean  {
    const data =  $('#' + id).val();
    if (data==null||data==''||data.trim() == ''){
      this.addErrorClass(id, error);
      return false;
    }else {
      this.removeErrorClass(id);
      return true;
    }
  }
  private verifyEmpty(id,label) {
    if(!this.isEmpty(id, label)) {
      return false;
    }else{
      return true;
    }
  }

  delete(code: number) {
    confirmFunc.init({
      'title': '提示',
      'mes': '是否删除？',
      'popType': 1,
      'imgType': 3,
      'callback': () => {
        // let url = "/mmall/laundry/deletetProduct/" + code; // 增加this.serveChat
        let url = "/mmall/laundry/deleteproviderTime/"+this.serveChat+'/' +code;
        this.ipSetting.sendGet(url).subscribe(data => {
          if (this.errorVoid.errorMsg(data)) {
            confirmFunc.init({
              'title': '提示' ,
              'mes': data['msg'],
              'popType': 0 ,
              'imgType': 1 ,
            });

          }

        });
      }
    });
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

export class ServeTime {
  facilitatorId: string;
  centerId:  string;
  day:   string;
  time:  string;
  bTime:       string;
  eTime:       string;
}
export class ServerCenter{
  name: string;
  id:number;
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