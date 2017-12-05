import { Injectable } from '@angular/core';

@Injectable()
export class GroupNotice {
  id:                     string; /*id*/
  notice:                string; /*通知内容*/
  status:                string; /*状态*/
  insertTime:           string; /*创建时间*/
  insertUser:           string;/*创建人*/
  updateTime:           string; /*更新时间*/
  updateUser:           string; /*更新人*/
  title:                 string; /*通知抬头*/

  constructor() { }

}
