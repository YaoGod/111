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
    localStorage.setItem("showUserName",this.user.username);
    localStorage.setItem("homeAddr",this.user.homeAddr);
    localStorage.setItem("teleNum",this.user.teleNum);
    localStorage.setItem("deptId",this.user.deptId);
    this.valueUpdated.next(this.user);
  }
  getVal():User {
    if(typeof (this.user.username) === "undefined" || this.user.username === null) {
      this.user.username =  localStorage.getItem("showUserName");
      this.user.userid    =  localStorage.getItem("username");
      this.user.homeAddr =  localStorage.getItem("homeAddr");
      this.user.teleNum =  localStorage.getItem("teleNum");
      this.user.deptId = localStorage.getItem("deptId");
    }
    return this.user;
  }
}
