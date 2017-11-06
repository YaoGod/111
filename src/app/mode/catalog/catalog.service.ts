import { Injectable } from '@angular/core';

@Injectable()
export class Catalog {
  /* 门户页一级目录 */
  name  : string;             /* 门户页一级目录名称 */
  childs: Array<sndCatalog>;  /* 门户页二级目录列表 */

}

export class sndCatalog {
  /* 门户页二级目录 */
   name    : string;  /* 门户页二级目录名称 */
   routeUrl: string;  /* 门户页二级目录路由指向 */
}
