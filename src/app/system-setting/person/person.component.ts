import { Component, OnInit } from '@angular/core';
import {UserPortalService} from "../../service/user-portal/user-portal.service";
import {ErrorResponseService} from "../../service/error-response/error-response.service";
import {User} from "../../mode/user/user.service";
import {GlobalUserService} from "../../service/global-user/global-user.service";

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {

  public user: User;
  constructor(
    private globalUserService:GlobalUserService,
    private userPortalService:UserPortalService,
    private errorResponseService:ErrorResponseService
  ) { }

  ngOnInit() {
    this.user = new User();
    this.user.userid = this.globalUserService.getVal().userid;
    this.getPersonalMsg(this.user.userid);
  }
  getPersonalMsg(id){
    this.userPortalService.getUserInfo(id)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.user = data.data;
        }
      })
  }
}
