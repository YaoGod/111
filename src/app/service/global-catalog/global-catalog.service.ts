import { Injectable } from '@angular/core';
import { Catalog, sndCatalog } from "../../mode/catalog/catalog.service";
import { Router} from '@angular/router';
import { Subject } from 'rxjs';
import { Http, RequestOptions, Headers} from '@angular/http';
import { IpSettingService } from '../ip-setting/ip-setting.service';
@Injectable()
export class GlobalCatalogService {
  private catalog:Array<Catalog> = new Array<Catalog>();
  private title: string = "统一信息平台";
  valueUpdated:Subject<any> = new Subject<any>();
  titleUpdate :Subject<string> = new Subject<string>();
  private headers = new Headers({'Content-Type': 'application/json'});
  private options =  new RequestOptions({
    headers: this.headers,
    withCredentials: true,
  });
  constructor(
    private router:Router,
    private http: Http,
    private ipSetting  : IpSettingService
  ) { }
  /*目录结构*/
  setVal(val:Array<Catalog>){
    this.catalog = val;
    this.valueUpdated.next(this.catalog);
  }
  /*获取目录列表*/
  getVal():Array<Catalog>{
    return this.catalog;
  }
  /*获取页面权限*/
  getRole(path:string): sndCatalog{
    for(let i = 0; i<this.catalog.length; i++){
      for(let j = 0; j<this.catalog[i].childs.length; j++){
        if(this.catalog[i].childs[j].routeUrl === path){
          let rule = this.catalog[i].childs[j];
          return rule;
        }
      }
    }
    return null;
  }
  /*设定一二级目录名称*/
  setTitle(val:string){
    this.title = val;
    this.titleUpdate.next(this.title);
  }
  /*获取目录列表*/
  getTitle():string{
    return this.title;
  }
  /*获取指定目录权限*/
  getCata(fatherId,name,path){
    const url = this.ipSetting.ip + "/portal/user/getCata/"+fatherId+"/"+name +"?url="+path;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
}
