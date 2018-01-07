import { Injectable } from '@angular/core';
import { User } from "../../mode/user/user.service";
import { Subject } from 'rxjs';
@Injectable()
export class GlobalUserService {
  private user : User = new User();
  valueUpdated:Subject<User> = new Subject<User>();
  constructor() { }

  setVal(val:User) {
    this.user = val;
    this.valueUpdated.next(this.user);
  }
  getVal():User {
    if(typeof (this.user.username) === "undefined" || this.user.username === null) {
      this.user.username =  localStorage.getItem("showUserName");
    }
    return this.user;
  }
}
