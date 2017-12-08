import { Injectable } from '@angular/core';

@Injectable()
export class Catalog {
  /* 门户页一级目录 */
  name  : string;             /* 门户页一级目录名称 */
  routeUrl: string;
  childs: Array<Catalog>;  /* 门户页二级目录列表 */
  isInstall: boolean;
  isDelete : boolean;
  isSelect : boolean;
  isUpdate : boolean;
}

export class sndCatalog {
  /* 门户页二级目录 */
  name    : string;  /* 门户页二级目录名称 */
  routeUrl: string;  /* 门户页二级目录路由指向 */
  isInstall: boolean;
  isDelete : boolean;
  isSelect : boolean;
  isUpdate : boolean;
}
