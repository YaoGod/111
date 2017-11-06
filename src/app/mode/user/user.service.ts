import { Injectable } from '@angular/core';

@Injectable()
export class User {

  /*登陆用户*/
  id       : number;
  name     : string;
  password : string;
}
