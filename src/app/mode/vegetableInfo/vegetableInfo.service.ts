import { Injectable } from '@angular/core';

@Injectable()
export class Vegetable{
  code:              string;/*净菜编号*/
  vname:              string;/*净菜名称*/
  imgPath:             string;/*净菜图片*/
  detail:            string;/*净菜详情*/
  price:              number;/*净菜价格*/
  status:             string;/*净菜状态*/
  limitnum:           number;/*限购数量*/
  saletime:           string;
}
