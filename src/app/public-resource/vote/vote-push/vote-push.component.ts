import { Component, OnInit } from '@angular/core';
import {Vote} from "../../../mode/vote/vote.service";
declare var $:any;
@Component({
  selector: 'app-vote-push',
  templateUrl: './vote-push.component.html',
  styleUrls: ['./vote-push.component.css']
})
export class VotePushComponent implements OnInit {

  public copyVote : Vote;
  constructor() { }

  ngOnInit() {
    this.copyVote = new Vote();
  }

  /*非空验证*/
  verifyEmpty( value, id?){
    if(typeof (value) === "undefined" ||
      value === null ||
      value === ''){
      this.addErrorClass(id,'该值不能为空');
      return false;
    }else{
      this.removeErrorClass(id);
      return true;
    }
  }
  /* 添加错误信息*/
  private addErrorClass(id: string, error: string)  {
    $('#' + id).addClass('red');
    $('#' + id).parent().next('.error').fadeIn().html(error);
  }
  /*去除错误信息*/
  private  removeErrorClass(id: string) {
    $('#' + id).removeClass('red');
    $('#' + id).parent().next('.error').fadeOut();
  }
}
