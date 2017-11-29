import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
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
  ) { }
  /*新增大楼档案类型*/
  addDossier(data) {
    const url = "/proxy/building/dossierClass/addDossier";
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
  /*删除大楼档案类型*/
  deleteDossier(id) {
    const url = "/proxy/building/dossierClass/deleteDossier/" + id;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
   /*获取大楼档案列表*/
  getDossierList(search,pageNo,pageSize) {
    const url = "/proxy/building/dossierClass/getDossierList/"+ pageNo + "/" + pageSize + "?search=" + search;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
  updateDossier(data) {
    const url = "/proxy/building/dossierClass/updateDossier";
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
}
