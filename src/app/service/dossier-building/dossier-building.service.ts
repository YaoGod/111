import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { IpSettingService } from '../ip-setting/ip-setting.service';
import 'rxjs/add/operator/toPromise';
@Injectable()
export class DossierBuildingService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private options =  new RequestOptions({
    headers: this.headers,
    withCredentials: true
  });
  constructor(
    private http: Http,
    private ipSetting  : IpSettingService
  ) { }
  /*新增大楼档案类型*/
  addDossier(data) {
    const url = this.ipSetting.ip + "/proxy/building/dossierClass/addDossier";
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
  /*删除大楼档案类型*/
  deleteDossier(id) {
    const url = this.ipSetting.ip + "/building/dossierClass/deleteDossier/" + id;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
   /*获取大楼档案类型列表*/
  getDossierList(search,pageNo,pageSize) {
    const url = this.ipSetting.ip + "/building/dossierClass/getDossierList/"+ pageNo + "/" + pageSize + "?search=" + search;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*更新大楼档案类型列表*/
  updateDossier(data) {
    const url = this.ipSetting.ip + "/building/dossierClass/updateDossier";
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
  /*新增物业档案*/
  addPropertyDossier(data) {
    const url = this.ipSetting.ip + "/building/dossier/addPropertyDossier";
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
  /*更新物业档案细项*/
  updatePropertyDossier(data) {
    const url = this.ipSetting.ip + "/building/dossier/updatePropertyDossier";
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
  /*删除物业档案*/
  deletePropertyDossier(id) {
    const url = this.ipSetting.ip + "/building/dossier/deletePropertyDossier/" + id;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*获取物业档案细项列表*/
  getPropertyDossier(data,pageNo,pageSize) {
    const url = this.ipSetting.ip + "/building/dossier/getPropertyDossierList/"
      +data.buildingId+"/"+data.classId+"/list/"+pageNo+"/"+pageSize;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*导出物业档案细项列表*/
  exportPropertyDossier(data,pageNo,pageSize) {
    const url = this.ipSetting.ip + "/building/dossier/getPropertyDossierList/"
      +data.buildingId+"/"+data.classId+"/excel/"+pageNo+"/"+pageSize;
    // 文件下载
    window.location.href = url;
    /*return this.http.get(url,this.options)
      .map(res => res.json());*/
  }
  /*获取档案类型列表*/
  getDossierClass(){
    const url =this.ipSetting.ip + "/building/dossier/getDossierClass";
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*删除物业档案集合*/
  deleteDossierGroup(classId,buildingId) {
    const url = this.ipSetting.ip + "/building/dossier/deleteDossierGroup/" + buildingId +"/" + classId;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*获取档案细项列表*/
  getDossierDetailList(data,pageNo,pageSize){
    const url = this.ipSetting.ip + "/building/dossier/getDossierList/"
      +data.buildingId+"/"+data.classId+"/"+pageNo+"/"+pageSize + "?search=" + data.text;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*获取档案详情实体类*/
  getDossierDetail(id) {
    const url = this.ipSetting.ip + "/building/dossier/getDossierDetail/" + id;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*获取台账列表*/
  getStandingBookList(data,pageNo,pageSize) {
    const url = this.ipSetting.ip + "/building/dossier/getStandingBookList/"+ pageNo + "/" + pageSize;
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
  /*新增台账*/
  addStandingBook(data) {
    const url = this.ipSetting.ip + "/building/dossier/addStandingBook";
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
  /*删除台账Group*/
  deleteStandingBookGroup(buildingId,classId) {
    const url =this.ipSetting.ip + "/building/dossier/deleteStandingBookGroup/" + buildingId + "/"+classId;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*删除单个台账*/
  deleteStandingBook(id) {
    const url =this.ipSetting.ip + "/building/dossier/deleteStandingBook/" + id;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  /*更新台账信息*/
  updateStandingBook(data) {
    const url =this.ipSetting.ip + "/building/dossier/updateStandingBook";
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
  /*获取台账细项列表*/
  getStandingBookInfoList(data,pageNo,pageSize) {
    const postData = {
      classId: data.classId,
      buildingId: data.buildingId
    };
    const url = this.ipSetting.ip + "/building/dossier/getStandingBookInfoList/"+
      pageNo + "/" + pageSize + "?search=" + data.text;
    return this.http.post(url,postData,this.options)
      .map(res => res.json());
  }
}
