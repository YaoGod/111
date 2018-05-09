import {Component, OnInit} from '@angular/core';
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";
import {FlowConfigure, FlowService} from "../../../service/flowConfigure/flow.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";
import {Person} from "../group-config/group-config.component";
import {SaleProductEmployeeService} from "../../../service/sale-product-employee/sale-product-employee.service";

declare var $: any;
declare var confirmFunc: any;

@Component({
  selector: 'app-reclaim',
  templateUrl: './reclaim.component.html',
  styleUrls: ['./reclaim.component.css'],
  providers: [FlowService, ErrorResponseService, SaleProductEmployeeService]
})
export class ReclaimComponent implements OnInit {

  public rule: any;

  public pageNo = 1;
  public pageSize = 15;
  public total = 0;
  public length = 10;
  public all: boolean;
  public beginCheck: boolean;
  public deptList: any;
  public groupList: any;
  public userId: string;
  public searchPerson: Person;
  public search: FlowConfigure;
  public flowConfigure: FlowConfigure;
  public flowList: Array<FlowConfigure>;

  constructor(private globalCatalogService: GlobalCatalogService,
              private errorResponseService: ErrorResponseService,
              private saleProductEmployeeService: SaleProductEmployeeService,
              private flowService: FlowService,
              public ipSetting: IpSettingService) {
    this.rule = this.globalCatalogService.getRole("system/flow");
  }

  ngOnInit() {
    this.globalCatalogService.setTitle("系统管理/工作流配置");

    this.globalCatalogService.valueUpdated.subscribe(
      (val) => {
        this.rule = this.globalCatalogService.getRole("system/flow");
        // this.getQuan();
      }
    );

    this.searchPerson = new Person();
    this.searchPerson.deptId = '46';
    this.search = new FlowConfigure();
    this.search.isdept = '';
    this.search.status = '';
    this.flowConfigure = new FlowConfigure();
    this.flowList = [];
    this.groupList = [];
    this.getDeptList();
    this.getUserList(1);
  }

  /*获取用户信息列表*/
  getUserList(num) {
    let postData = this.searchPerson;
    let url = '/portal/user/getUserBySome/1?pageNo='+num+'&&pageSize='+this.pageSize;
    this.ipSetting.sendPost(url,postData)
      .subscribe(data => {
        if (this.errorResponseService.errorMsg(data)) {
          this.flowList = data.data.infos;
          this.total = data.data.total;
        }
      })
  }

  /*获取所有部门列表*/
  getDeptList() {
    this.saleProductEmployeeService.getDeptList()
      .subscribe(data => {
        if (this.errorResponseService.errorMsg(data)) {
          this.deptList = data.data;
        }
      });
  }

  /*获取指定用户的指定群组*/
  getUserGroup(userId) {
    this.flowService.getUserGroup(userId)
      .subscribe(data => {
        if (this.errorResponseService.errorMsg(data)) {
          this.groupList = data.data;
        }
      });
  }

  /*跳转至我的群组*/
  myGroup(userId) {
    $('.mask1').fadeIn();
    this.userId = userId;
    this.getUserGroup(userId);
  }

  /*关闭*/
  closeNewUser() {
    $('.red').removeClass('red');
    $('.error').fadeOut();
    $('.mask,.mask1').hide();
  }

  /*全选*/
  public checkedAll() {
    let list = document.getElementsByName("orderCheck");
    for (let i = 0; i < list.length; i++) {
      list[i]['checked'] = this.all;
    }
  }

  /*判断是否全选*/
  public checkIsAll() {
    let list = document.getElementsByName("orderCheck");
    for (let i = 0; i < list.length; i++) {
      if (!list[i]['checked']) {
        this.all = false;
      }
    }
  }

  /*取消授权*/
  cancelAuthorization(id) {
    let arr = [];
    arr.push(id);
    let url = '/workflow/group/deleteBatchUserGroup';
    let postData = {
      userList: [this.userId],
      groupList: arr
    };
    this.ipSetting.sendPost(url, postData).subscribe(data => {
      if (this.errorResponseService.errorMsg(data)) {
        confirmFunc.init({
          'title': '提示',
          'mes': data.msg,
          'popType': 2,
          'imgType': 1
        });
        this.getUserGroup(this.userId);
      }
    });
  }

  /*一键取消授权*/
  onekeyCancelAuthorization(userId) {
    this.flowService.getUserGroup(userId)
      .subscribe(data => {
        if (this.errorResponseService.errorMsg(data)) {
          this.groupList = data.data;
          if (this.groupList.length <= 0) {
            confirmFunc.init({
              'title': '提示',
              'mes': '该用户暂无群组信息!',
              'popType': 2,
              'imgType': 1
            });
            return false;
          } else {
            confirmFunc.init({
              'title': '提示',
              'mes': '是否清空当前用户所有群组信息？',
              'popType': 1,
              'imgType': 3,
              "callback": () => {
                let url = '/workflow/group/deleteBatchUserGroup';
                let array = [];
                for (let i = 0; i < this.groupList.length; i++) {
                  array.push(this.groupList[i].id);
                }
                let postData = {
                  userList: [userId],
                  groupList: array
                };
                this.ipSetting.sendPost(url, postData)
                  .subscribe(data2 => {
                    if (this.errorResponseService.errorMsg(data2)) {
                      confirmFunc.init({
                        'title': '提示',
                        'mes': data2.msg,
                        'popType': 2,
                        'imgType': 1
                      });
                      // this.getUserList(1);
                    }
                  });
              }
            });
          }
        }
      });
  }

  /*批量取消授权*/
  cancelAllAuthorization() {
    this.beginCheck = false;
    let url = '/workflow/group/deleteAllUserGroup';
    let list = document.getElementsByName("orderCheck");
    let postData = [];
    let str = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i]['checked']) {
        str.push(list[i]['checked']);
        postData.push(list[i]['value']);
      }
    }
    for (let i = 0; i < str.length; i++) {
      if (str[i] === true) {
        this.beginCheck = true;
      }
    }
    if (this.beginCheck) {
      confirmFunc.init({
        'title': '提示',
        'mes': '是否清空所选人员群组信息？',
        'popType': 1,
        'imgType': 3,
        "callback": () => {
          this.ipSetting.sendPost(url, postData)
            .subscribe(data => {
              if (this.errorResponseService.errorMsg(data)) {
                confirmFunc.init({
                  'title': '提示',
                  'mes': '用户群组回收成功',
                  'popType': 2,
                  'imgType': 1
                });
                this.getUserList(1);
                this.all = false;
              }
            });
        }
      });
    } else {
      confirmFunc.init({
        'title': '提示',
        'mes': '请先选择需要回收群组的员工！',
        'popType': 2,
        'imgType': 2
      });
    }
  }

}
