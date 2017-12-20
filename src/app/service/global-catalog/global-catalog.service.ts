import { Injectable } from '@angular/core';
import { Catalog, sndCatalog } from "../../mode/catalog/catalog.service";
import { Router} from '@angular/router';
import { Subject } from 'rxjs';
@Injectable()
export class GlobalCatalogService {
  private catalog:Array<Catalog> = new Array<Catalog>();
  private title: string = "统一信息平台";
  valueUpdated:Subject<any> = new Subject<any>();
  titleUpdate :Subject<string> = new Subject<string>();
  constructor(
    private router:Router
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
}
