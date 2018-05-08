import { Component, OnInit } from '@angular/core';
import {FlowConfigure, FlowService} from "../../../service/flowConfigure/flow.service";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {Http} from "@angular/http";
import {SaleProductEmployeeService} from "../../../service/sale-product-employee/sale-product-employee.service";

declare var $:any;
declare var confirmFunc:any;

@Component({
  selector: 'app-group-config',
  templateUrl: './group-config.component.html',
  styleUrls: ['./group-config.component.css'],
  providers: [FlowService, ErrorResponseService,SaleProductEmployeeService]
})
export class GroupConfigComponent implements OnInit {

  public deptList:any;
  public pageNo;
  public pageSize = 10;
  public total = 0;
  public searchPerson: Person;
  public search: FlowConfigure;
  public flowConfigure:FlowConfigure;
  public flowList: Array<FlowConfigure>;
  public rule: any;
  public editBoole:boolean;
  public userList: any;
  public personList: any;
  public groupId:string;
  constructor(private http: Http,
    private globalCatalogService: GlobalCatalogService,
    private saleProductEmployeeService: SaleProductEmployeeService,
    private errorResponseService:ErrorResponseService,
    private flowService:FlowService,
    public ipSetting: IpSettingService
  ) {

  }

  ngOnInit() {
    this.globalCatalogService.setTitle("系统管理/工作流配置");
    this.getDeptList();
    this.search = new FlowConfigure();
    this.searchPerson = new Person();
    this.searchPerson.deptId = '46';
    this.flowConfigure = new FlowConfigure();
    this.flowList = [];
    this.search.isdept = '';
    this.search.status = '';
    this.getUserList();
    this.getGroupList(1);
    this.editBoole = true;
  }

  /*获取群组信息列表*/
  getGroupList(num){
    let url = "/workflow/group/getList/"+num+"/"+this.pageSize;
    let postData = this.search;
    this.ipSetting.sendPost(url,postData).subscribe(data => {
      if (this.errorResponseService.errorMsg(data)) {
        this.flowList = data.data.list;
      }
    });
  }

  /*查询人员列表*/
  getUserList(){
      let url = "/portal/user/getUserBySome/1";
      let postData = this.searchPerson;
      this.ipSetting.sendPost(url,postData).subscribe(data => {
        if (this.errorResponseService.errorMsg(data)) {
          // console.log(data.data);
          this.userList = data.data;
          /*this.entrySecurity.employee = data.data.username;
           for (let j in this.deptList) {
           if (this.deptList[j].DEPT_NAME === data.data.deptId) {
           this.entrySecurity.deptId = this.deptList[j].DEPT_ID;
           }
           }*/
        }
      });
  }
  /*获取所有部门列表*/
  getDeptList(){
    this.saleProductEmployeeService.getDeptList()
      .subscribe(data =>{
        if(this.errorResponseService.errorMsg(data)){
          this.deptList = data.data;
        }
      });
  }
  /*获取指定群组人员*/
  getAppoint(id){
    let url = '/workflow/group/getUserList/1/9999/'+id;
    this.ipSetting.sendGet(url).subscribe(data => {
      if (this.errorResponseService.errorMsg(data)) {
        this.personList = data.data.list;
      }
    });
  }
  /*新增*/
  newUser(){
    this.editBoole = true;
    this.flowConfigure = new FlowConfigure();
    this.flowConfigure.name = '';
    this.flowConfigure.isdept= '1';
    $('#newUser .modal-title').html('工作流群组新增');
    $('#newUser').show();
  }
  /*关闭*/
  closeNewUser(){
    $('.red').removeClass('red');
    $('.error').fadeOut();
    $('.mask,.mask1,.mask2').hide();
  }
  /*增加群组人员*/
  addPerson(id){
    $('.mask1').fadeIn();
    this.groupId = id;
    this.getAppoint(id);
  }

  /*编辑群组*/
  editName(id,name,isdept){
    this.editBoole = false;
    $('#newUser').show();
    this.flowConfigure.id = id;
    this.flowConfigure.name = name;
    this.flowConfigure.isdept = isdept;
    $('#newUser .modal-title').html('工作流群组编辑');
  }
  /*启用不可用*/
  abateNameOK(id){
    let url = '/workflow/group/del';
    let postData = {
      id: id,
      status: '1'
    };
    this.ipSetting.sendPost(url,postData).subscribe(data => {
      if (this.errorResponseService.errorMsg(data)) {
        confirmFunc.init({
          'title': '提示' ,
          'mes': '操作成功',
          'popType': 0,
          'imgType': 1,
        });
        this.getGroupList(1);
      }
    });
  }
  /*不可用操作*/
  abateNameNO(id){
    confirmFunc.init({
      'title': '提示',
      'mes': '是否使群组不可用？',
      'popType': 1,
      'imgType': 3,
      "callback": () => {
        let url = '/workflow/group/del';
        let postData = {
          id: id,
          status: '0'
        };
        this.ipSetting.sendPost(url,postData).subscribe(data => {
          if (this.errorResponseService.errorMsg(data)) {
            confirmFunc.init({
              'title': '提示' ,
              'mes': data['msg'],
              'popType': 0,
              'imgType': 1,
            });
            this.getGroupList(1);
          }
        });
      }
    });
  }
  /*加入群组*/
  addPersonList(userid){
    let url = '/workflow/group/addUserGroup/'+userid+'/'+this.groupId;
    this.ipSetting.sendGet(url).subscribe(data => {
      if (this.errorResponseService.errorMsg(data)) {
        confirmFunc.init({
          'title': '提示' ,
          'mes': data['msg'],
          'popType': 0 ,
          'imgType': 1,
        });
        this.getAppoint(this.groupId);
      }
    });
  }
  /*群组人员删除*/
  delPersonList(userid){
    confirmFunc.init({
      'title': '提示',
      'mes': '是否删除此人员？',
      'popType': 1,
      'imgType': 3,
      "callback": () => {
        let userList = [];
        let groupList = [];
        userList.push(userid);
        groupList.push(this.groupId);
        let url = '/workflow/group/deleteBatchUserGroup';
        let postData = {
          userList:userList,
          groupList:groupList
        };
        this.ipSetting.sendPost(url,postData).subscribe(data => {
          if (this.errorResponseService.errorMsg(data)) {
            confirmFunc.init({
              'title': '提示' ,
              'mes': data['msg'],
              'popType': 0 ,
              'imgType': 1,
            });
            this.getAppoint(this.groupId);
          }
        });
      }
    });
  }
  /*确定*/
  submitNew(){
    let url ;
    if(this.editBoole === true){
      url = '/workflow/group/add';
    }else{
      url = '/workflow/group/modify';
    }
    let postData = JSON.parse(JSON.stringify(this.flowConfigure));
    this.ipSetting.sendPost(url,postData).subscribe(data => {
      if (this.errorResponseService.errorMsg(data)) {
        confirmFunc.init({
          'title': '提示' ,
          'mes': data['msg'],
          'popType': 0 ,
          'imgType': 1,
        });
        this.getGroupList(1);
      }
    });
    $('#newUser').hide();
  }
  checkPerson(id){
    $('.mask2').fadeIn();
    this.getAppoint(id);
  }

  /*导入*/
  prese_upload(files) {
    var xhr = this.flowService.importCard(files[0],this.groupId);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 &&(xhr.status === 200 || xhr.status === 304)) {
        var data:any = JSON.parse(xhr.responseText);
        if(this.errorResponseService.errorMsg(data)) {
          if(data.status === 0&&data.data.result==='success'){
            confirmFunc.init({
              'title': '提示' ,
              'mes': '导入成功',
              'popType': 0 ,
              'imgType': 1,
            });

            this.getAppoint(this.groupId);
          }else if(data.data.result==='fail'){
            confirmFunc.init({
              'title': '提示',
              'mes': '导入失败，是否下载错误信息？',
              'popType': 1,
              'imgType': 3,
              "callback": () => {
                window.location.href = this.ipSetting.ip+'/building/employCard/downExcel/'+data.data.fileName;
              }
            })
          }
          $('#prese').val('');
        }else{
          $('#prese').val('');
        }
      }
    };
  }




  /*非空验证*/
  verifyEmpty( value, id?){
    if(typeof (value) === "undefined" ||
      value === null ||
      value === ''){
      this.addErrorClass(id,'该值不能为空');
      return false;
    }else{
      this.removeErrorClass(id);
      return true;
    }
  }
  /* 添加错误信息*/
  private addErrorClass(id: string, error: string)  {
    $('#' + id).addClass('red');
    $('#' + id).parent().next('.error').fadeIn().html(error);
  }
  /*去除错误信息*/
  private  removeErrorClass(id: string) {
    $('#' + id).removeClass('red');
    $('#' + id).parent().next('.error').fadeOut();
  }

}
export class Person {
  deptId   : string;
  deptName : string;
  userid : number;
  username:string;

}
