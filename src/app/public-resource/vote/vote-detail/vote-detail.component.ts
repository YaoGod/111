import { Component, OnInit } from '@angular/core';
import {PublicresourceVoteService} from "../../../service/publicresource-vote/publicresource-vote.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {ActivatedRoute, Params} from "@angular/router";
import {Vote} from "../../../mode/vote/vote.service";
import 'rxjs/add/operator/switchMap';
declare var $:any;
declare var confirmFunc:any;
@Component({
  selector: 'app-vote-detail',
  templateUrl: './vote-detail.component.html',
  styleUrls: ['./vote-detail.component.css'],
})
export class VoteDetailComponent implements OnInit {

  public vote:Vote;
  constructor(
    private route: ActivatedRoute,
    private publicresourceVoteService:PublicresourceVoteService,
    private errorResponseService:ErrorResponseService
  ) { }

  ngOnInit() {
    this.vote = new Vote();
    if(typeof (this.route.params['_value']['id']) !== "undefined"){
      let tempid = 0;
      this.route.params
        .switchMap((params: Params) => this.vote.id  = params['id'])
        .subscribe(() => {
          if (tempid === 0) {
            this.getVoteInfo(this.vote.id);
            tempid++;
          }
        });
    }
  }

  /*获取投票信息*/
  getVoteInfo(id){
    this.publicresourceVoteService.getVoteInfo(id)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.vote = data.data;
        }
      })
  }

  submit(){
    let result = [];
    for(let i = 0;i<this.vote.options.length;i++){
      if(this.vote.options[i].choose){
        result.push(this.vote.options[i].title);
      }
    }
    this.publicresourceVoteService.addVoteResult(this.vote.id,result)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          confirmFunc.init({
            'title': '提示',
            'mes': data.msg,
            'popType': 2,
            'imgType': 1,
            "callback": () => {
              history.go(-1);
            },
            "cancel": () => {
              history.go(-1);
            }
          });
        }
      })
  }
  watchOptType(index){
    if(this.vote.type==="single"){
      for(let i = 0;i<this.vote.options.length;i++){
        if(i!== index){
          this.vote.options[i].choose = false;
        }
      }
    }
  }
}
