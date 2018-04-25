import {Component, ElementRef, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {GlobalCatalogService} from "../../service/global-catalog/global-catalog.service";
import {UserPortalService} from "../../service/user-portal/user-portal.service";
import {ErrorResponseService} from "../../service/error-response/error-response.service";
import {GlobalUserService} from "../../service/global-user/global-user.service";
import {Role} from "../../mode/user/user.service";
import 'rxjs/add/operator/switchMap';
import 'ztree';
declare var $: any;
@Component({
  selector: 'app-join-ability',
  templateUrl: './join-ability.component.html',
  styleUrls: ['./join-ability.component.css','../../../../node_modules/ztree/css/zTreeStyle/zTreeStyle.css']
})
export class JoinAbilityComponent implements OnInit {

  public role:Role;
  constructor(
    private route: ActivatedRoute,
    private globalCatalogService: GlobalCatalogService,
    private userPortalService:UserPortalService,
    private errorResponseService:ErrorResponseService,
    private globalUserService:GlobalUserService,
    public el: ElementRef
  ) { }

  ngOnInit() {
    this.globalCatalogService.setTitle("系统管理/角色配权限");
    this.role = new Role();
    if(typeof (this.route.params['_value']['id']) !== "undefined"){
      let tempid = 0;
      this.route.params
        .switchMap((params: Params) => this.role.roleId  = params['id'])
        .subscribe(() => {
          if (tempid === 0) {
            this.getRoleMsg(this.role.roleId);
            tempid++;
          }
        });
    }
    this.importZTreeData();
  }
  /*获取角色信息*/
  getRoleMsg(id){
    this.userPortalService.getRoleInfo(id)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.role = data.data;
        }
      })
  }
  importZTreeData(){
    let setting = {
      isSimpleData : true,            //制定可以支持数据结构，不用转换为复杂的josn对象

      showIcon : false,               //不显示图标

      treeNodeKey : "id",             //如指定isSimpleDate:true,这个属性必须被指定

      treeNodeParentKey : "parentId", //如指定isSimpleDate:true,这个属性必须被指定

      showLine : true,                //显示父子之间的线

      checkable : true,               //节点前面显示check组件

      checkType : { "Y": "", "N": "" },//点击的时候父子节点都不影响

      checkStyle : "checkbox",         //check组件类型为checkbox

      checkRadioType : "all",

      data: {
        simpleData: {
          enable: true
        }
      }
    };
    let zNodes = [
      { id: 1, pId: 0, name: "父节点1 - 展开", open: true },
      { id: 11, pId: 1, name: "父节点11 - 折叠" },
      { id: 111, pId: 11, name: "叶子节点111" },
      { id: 112, pId: 11, name: "叶子节点112" },
      { id: 113, pId: 11, name: "叶子节点113" },
      { id: 114, pId: 11, name: "叶子节点114" },
      { id: 12, pId: 1, name: "父节点12 - 折叠" },
      { id: 121, pId: 12, name: "叶子节点121" },
      { id: 122, pId: 12, name: "叶子节点122" },
      { id: 123, pId: 12, name: "叶子节点123" },
      { id: 124, pId: 12, name: "叶子节点124" },
      { id: 13, pId: 1, name: "父节点13 - 没有子节点", isParent: true },
      { id: 2, pId: 0, name: "父节点2 - 折叠" },
      { id: 21, pId: 2, name: "父节点21 - 展开", open: true },
      { id: 211, pId: 21, name: "叶子节点211" },
      { id: 212, pId: 21, name: "叶子节点212" },
      { id: 213, pId: 21, name: "叶子节点213" },
      { id: 214, pId: 21, name: "叶子节点214" },
      { id: 22, pId: 2, name: "父节点22 - 折叠" },
      { id: 221, pId: 22, name: "叶子节点221" },
      { id: 222, pId: 22, name: "叶子节点222" },
      { id: 223, pId: 22, name: "叶子节点223" },
      { id: 224, pId: 22, name: "叶子节点224" },
      { id: 23, pId: 2, name: "父节点23 - 折叠" },
      { id: 231, pId: 23, name: "叶子节点231" },
      { id: 232, pId: 23, name: "叶子节点232" },
      { id: 233, pId: 23, name: "叶子节点233" },
      { id: 234, pId: 23, name: "叶子节点234" },
      { id: 3, pId: 0, name: "父节点3 - 没有子节点", isParent: true }
    ];
    $.fn.zTree.init($("#ztree"),setting,zNodes);
  }
  submit(){

  }
}
