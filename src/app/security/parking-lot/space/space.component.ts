import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-space',
  templateUrl: './space.component.html',
  styleUrls: ['./space.component.css']
})
export class SpaceComponent implements OnInit {
  public pageSize = 6;
  public pageNo = 1;
  public total = 0;
  public length = 5;
  public newCard = new CardInfo();
  public record:any;
  constructor() { }

  ngOnInit() {

  }
  addVehicle(){

  }

  /*点击编辑*/
  editCardInfo(id){
    /*this.contractBool = false;
    let url = '/building/carInfo/getCarInfo/'+id;
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorVoid.errorMsg(data)) {
        // console.log(data.data);
        this.newCard = data.data
      }
    });
    $('.mask').fadeIn();
    $('.mask .mask-head p').html('编辑车辆信息');*/
  }
  /*点击删除*/
  delCardInfo(id){
    /*confirmFunc.init({
      'title': '提示' ,
      'mes': '是否删除？',
      'popType': 1 ,
      'imgType': 3 ,
      'callback': () => {
        let url = '/building/carInfo/deleteCarInfo/'+id;
        this.ipSetting.sendGet(url).subscribe(data => {
          if(this.errorVoid.errorMsg(data)) {
            confirmFunc.init({
              'title': '提示' ,
              'mes': data['msg'],
              'popType': 0 ,
              'imgType': 1 ,
            });
            this.pageNo = 1;
            this.getPermitInfo(this.searchInfo);
          }
        });
      }
    });*/

  }
  repairSearch(num){

  }
}
export class CardInfo {
  id: number; // 本条信息ID
  useUserId: string;// 员工编号
  createUserName:string; // 员工姓名
  createUserDept: string; // 员工部门
  eTime:string; // 有效期
  modifyTime: string; // 发放日期
  useCarCode: string; // 车牌号
  driverNum: string; // 驾驶证号
  driverCode: string; // 驾驶证档案编号
  carOwner: string; // 车辆所有人姓名
  carNumber: string; // 车牌号码
  carCode: string; // 车辆识别代码
  motorNum: string; // 发动机号
  carBrand:string; // 车辆品牌型号
  isPark: string = ''; // 是否停车摇号
  carFare: string; // 交通费额度
  imgPath:string;
  imgContentList={
    driverA: [], // 驾驶证
    driverB: []  // 行驶证
  };
  imgPathList={
    driverA: [],
    driverB: []
  }
}
