import { Injectable } from '@angular/core';
import { Catalog, sndCatalog } from "../../mode/catalog/catalog.service";
import { Subject } from 'rxjs';
@Injectable()
export class GlobalCatalogService {
  private catalog:Array<Catalog> = new Array<Catalog>();
  valueUpdated:Subject<any> = new Subject<any>();
  constructor() { }

  setVal(val:Array<Catalog>){
    this.catalog = val;
    this.valueUpdated.next(this.catalog);
  }

  getVal():Array<Catalog>{
    return this.catalog;
  }
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
}
