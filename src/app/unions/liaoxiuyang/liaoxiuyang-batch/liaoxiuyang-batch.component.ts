import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {Department} from "../../../employ/share/share-new-product/share-new-product.component";
import {GlobalUserService} from "../../../service/global-user/global-user.service";
declare var $: any;
declare var confirmFunc: any;
@Component({
  selector: 'app-liaoxiuyang-batch',
  templateUrl: './liaoxiuyang-batch.component.html',
  styleUrls: ['./liaoxiuyang-batch.component.css']
})
export class LiaoxiuyangBatchComponent implements OnInit {

  public searchInfo : Batch;
  public batches: Array<Batch>;
  public deptList  : Array<Department>;
  public lines: Array<Batch>;
  public hotels: Array<Department>;
  public newBatch: Batch;
  public pageSize = 10;
  public pageNo = 1;
  public total = 0;
  public isMyDept  : boolean;
  public isAllDept : boolean;
  public user;
  constructor(
    public http:Http,
    public ipSetting:IpSettingService,
    public errorVoid:ErrorResponseService,
    private globalCatalogService:GlobalCatalogService,
    private globalUserService: GlobalUserService
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("工会管理/疗休养/批次管理");
    this.user =this.globalUserService.getVal();
    this.searchInfo = new Batch();
    this.searchInfo.lineId = "";
    this.batches = new Array<Batch>(0);
    this.newBatch = new Batch();
    this.newBatch.deptName = [];
    this.newBatch.deptId = [];
    this.newBatch.place  = [];
    this.lines = [];
    this.hotels = [];
    this.getLines();
    this.getDeptList();
    this.batchSearch(1);
  }
  getLines(){
    let url = "/soclaty/tourline/getTourLineSelect";
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorVoid.errorMsg(data)){
        this.lines = data.data;
      }
    });
  }
  batchSearch(num){
    this.pageNo = num;
    let url = '/soclaty/tourbatch/getTourBatchList/'+this.pageNo+'/'+this.pageSize;
    this.ipSetting.sendPost(url,this.searchInfo).subscribe(data => {
      if(this.errorVoid.errorMsg(data)){
        this.batches = data.data.infos;
        this.total = data.data.total;
      }
    });
  }
  setHotel(id){
    let temp = [];
    for(let i=0;i<this.lines.length;i++){
      if(this.lines[i].id.toString()=== id.toString()){
        temp = this.lines[i].hotel;
      }
    }
    this.hotels = [];
    for(let i=0;i<temp.length;i++){
      this.hotels[i] = new Department();
      this.hotels[i].value = temp[i];
      this.hotels[i].choose = false;
    }
  }
  addNewBatch(){
    this.newBatch = new Batch();
    this.newBatch.lineId = "";
    this.newBatch.deptId = [this.user.deptId];
    this.newBatch.deptName = ['本部门'];
    this.newBatch.place  = [{name:""}];
    this.hotels = [];
    $('#pici').fadeIn();
  }
  editBatch(batch){
    this.addNewBatch();
    $("#pici .mask-head>p").html("编辑批次");
    this.newBatch = JSON.parse(JSON.stringify(batch));
    this.setHotel(this.newBatch.lineId);
    for(let i=0;i<this.hotels.length;i++){
      this.hotels[i].choose = false;
      for(let j=0;j<this.newBatch.hotel.length;j++){
        if(this.hotels[i].value === this.newBatch.hotel[j]){
          this.hotels[i].choose = true;
        }
      }
    }
    let tempPlace = [];
    for(let i = 0;i<this.newBatch.place.length;i++){
      tempPlace.push({name:this.newBatch.place[i]});
    }
    this.newBatch.place = tempPlace;
  }
  delBatch(id){
    confirmFunc.init({
      'title': '提示' ,
      'mes': "是否删除该批次？",
      'popType': 1,
      'imgType': 3,
      'callback': () => {
        let url = "/soclaty/tourbatch/deleteTourBatch/"+id;
        this.ipSetting.sendGet(url).subscribe(data => {
          if(this.errorVoid.errorMsg(data)){
            confirmFunc.init({
              'title': '提示' ,
              'mes': data.msg,
              'popType': 0 ,
              'imgType': 1 ,
            });
            this.batchSearch(1);
          }
        });
      }
    });
  }
  /*取消*/
  addCancel(){
    $('.mask').fadeOut();
    $('.errorMessage').html('');
  }
  submit(){
    if(!this.verifyEmpty('newLineId')){
      return false;
    }
    if(!this.verifyEmpty('newGoTime')){
      return false;
    }
    if(!this.verifyEmpty('newBeginTime')){
      return false;
    }
    if(Date.parse(this.newBatch.beginTime)>Date.parse(this.newBatch.goTime)){
      this.addErrorClass("newBeginTime", "不能晚于出发时间");
      return false;
    }else{
      this.removeErrorClass("newBeginTime");
    }
    if(!this.verifyEmpty('newEndTime')){
      return false;
    }
    if(Date.parse(this.newBatch.endTime)>Date.parse(this.newBatch.goTime)){
      this.addErrorClass("newEndTime", "不能晚于出发时间");
      return false;
    }else{
      this.removeErrorClass("newEndTime");
    }
    if(Date.parse(this.newBatch.endTime)<Date.parse(this.newBatch.beginTime)){
      this.addErrorClass("newEndTime", "不能早于报名开始时间");
      return false;
    }else{
      this.removeErrorClass("newEndTime");
    }
    let verityData;
    let tempPlaceArray = [];
    for(let i = 0;i<this.newBatch.place.length;i++){
      verityData =  this.newBatch.place[i].name;
      if(verityData === ""&&verityData.toString().trim() === ''){
        this.addErrorClass("newPlace", "第"+(i+1)+"条的出团地点为空");
        return false;
      }else{
        tempPlaceArray.push(verityData.toString().trim());
        this.removeErrorClass("newPlace");
      }
    }
    this.newBatch.hotel = [];
    for(let i=0;i<this.hotels.length;i++){
      if(this.hotels[i].choose){
        this.newBatch.hotel.push(this.hotels[i].value);
      }
    }
    if(this.newBatch.hotel.length===0&&this.hotels.length>0){
      this.addErrorClass("newHotel", "请选择");
      return false;
    }else {
      this.removeErrorClass("newHotel");
    }
    let url;
    if(this.newBatch.id){
      url = "/soclaty/tourbatch/updateTourBatch";
    }else {
      url = "/soclaty/tourbatch/addTourBatch";
    }
    let postData  = JSON.parse(JSON.stringify(this.newBatch));
    postData.place = tempPlaceArray;
    tempPlaceArray = null;
    this.ipSetting.sendPost(url, postData)
      .subscribe(data => {
        if(this.errorVoid.errorMsg(data)){
          confirmFunc.init({
            'title': '提示' ,
            'mes': data.msg,
            'popType': 0 ,
            'imgType': 1 ,
          });
          this.batchSearch(1);
          this.addCancel();
        }
      });
  }
  public verifyEmpty(id){
    if (!this.isEmpty(id, '不能为空')) {
      return false;
    }
    return true;
  }
  /**非空校验*/
  public isEmpty(id: string, error: string): boolean  {
    const data =  $('#' + id).val();
    if(typeof (data)==="undefined"|| data === null){
      this.addErrorClass(id, error);
      return false;
    }else{
      if (data.toString().trim() === '')  {
        this.addErrorClass(id, error);
        return false;
      }else {
        this.removeErrorClass(id);
        return true;
      }
    }
  }
  /** 添加错误信息class */
  public  addErrorClass(id: string, error?: string){
    $('#' + id).parents('.form-inp').addClass('form-error');
    if (error === undefined || error.trim().length === 0 ) {
      $('#' + id).next('span').html('输入错误');
    }else {
      $('#' + id).next('span').html(error);
    }
  }
  /**去除错误信息class */
  public  removeErrorClass(id: string) {
    $('#' + id).parents('.form-inp').removeClass('form-error');
    $('#' + id).parents('.form-inp').children('.errorMessage').html('');
  }
  addPlace(index){
    this.newBatch.place.splice(index+1,0,{name:""});
  }
  delPlace(index){
    this.newBatch.place.splice(index,1);
  }
  /*获取所有部门列表*/
  getDeptList(){
    const url = "/portal/user/getDeptList";
    this.ipSetting.sendGet(url).subscribe(data => {
      if(this.errorVoid.errorMsg(data)){
        this.deptList = data.data;
        for(let i = 0;i<this.deptList.length;i++){
          this.deptList[i].choose = false;
        }
      }
    });
  }
  /*打开部门选择框*/
  openChooseWin(){
    $('#deptSltWin').show();
    for(let i = 0;i<this.deptList.length;i++){
      this.deptList[i].choose = false;
    }
    for(let i = 0;i<this.deptList.length;i++){
      for(let j = 0 ;j<this.newBatch.deptId.length;j++){
        if(this.deptList[i].DEPT_ID === this.newBatch.deptId[j]
          ||this.newBatch.deptId[j] === 'all'){
          this.deptList[i].choose = true;
        }
        if(this.newBatch.deptId[j] === 'all'){
          this.isAllDept = true;
        }
        if(this.newBatch.deptId[j] === this.user.deptId){
          this.isMyDept = true;
        }
      }
    }

  }
  /*选取部门*/
  chooseDept(){
    this.isAllDept = false;
    this.isMyDept = false;
    this.newBatch.deptId = [];
    this.newBatch.deptName = [];
    for(let i = 0;i<this.deptList.length;i++){
      if(this.deptList[i].choose){
        this.newBatch.deptId.push(this.deptList[i].DEPT_ID);
        this.newBatch.deptName.push(this.deptList[i].DEPT_NAME);
        if(this.deptList[i].DEPT_ID === this.user.deptId){
          this.isMyDept = true;
        }
      }
    }
    if(this.newBatch.deptId.length === 0){
      this.isAllDept = false;
    }
  }
  /*选择本部门*/
  setMyDept(id){
    if(!this.isMyDept){
      this.newBatch.deptId = [];
      this.newBatch.deptName = [];
      this.isAllDept = false;
    }
    for (let i = 0; i < this.deptList.length; i++) {
      if(this.isMyDept){
        this.deptList[i].choose = false;
      }
      if(this.deptList[i].DEPT_ID === this.user.deptId){
        this.deptList[i].choose = this.isMyDept;
      }
      if(!this.isMyDept){
        if(this.deptList[i].choose){
          this.newBatch.deptId.push(this.deptList[i].DEPT_ID);
          this.newBatch.deptName.push(this.deptList[i].DEPT_NAME);
        }
      }
    }
    if(this.isMyDept){
      this.newBatch.deptId = [id];
      this.newBatch.deptName = ['本部门'];
    }
  }
  /*全选*/
  chooseAll() {
    if(this.isAllDept){
      this.newBatch.deptId = ['all'];
      this.newBatch.deptName = ['全公司'];
    }else{
      this.newBatch.deptId = [];
      this.newBatch.deptName = [];
    }
    for (let i = 0; i < this.deptList.length; i++) {
      this.deptList[i].choose = this.isAllDept;
    }
    this.isMyDept = this.isAllDept;
  }
}

export class Batch {
  id: string;
  code: string;
  name: string;
  lineId: any;
  lineName: string;
  deptId: Array<string>;
  deptName: Array<string>;
  hrmis: any;
  batchId: string;
  goTime: string;
  goBTime: string;
  goETime: string;
  backTime:string;
  beginTime: string;
  endTime: string;
  createTime: string;
  createUserDept: string;
  createUserId: string;
  createUserName: string;
  maxNum: number;
  minNum: number;
  realNum: number;
  hotel: Array<string>;
  place: Array<any>;
  status: string;
  /*更多*/
  tourLine: any;
  isCouldSure: boolean;
}
