import { Component, OnInit } from '@angular/core';
import {Vote} from "../../../mode/vote/vote.service";
import {PublicresourceVoteService} from "../../../service/publicresource-vote/publicresource-vote.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
declare var confirmFunc:any;
declare var $:any;
@Component({
  selector: 'app-vote-mang',
  templateUrl: './vote-mang.component.html',
  styleUrls: ['./vote-mang.component.css']
})
export class VoteMangComponent implements OnInit {

  public pageNo : number;
  public pageSize = 10;
  public total = 0;
  public search : Vote;
  public votes: Array<Vote>;
  constructor(
    private publicresourceVoteService:PublicresourceVoteService,
    private errorResponseService:ErrorResponseService
  ) { }

  ngOnInit() {
    this.votes = [];
    this.search = new Vote();
    this.getVotes(1);
  }
  /*获取投票列表*/
  getVotes(pageNo: number){
    this.pageNo = pageNo;
    this.publicresourceVoteService.getVoteInfoList(this.pageNo,this.pageSize,this.search)
      .subscribe(data => {
        if(this.errorResponseService.errorMsg(data)){
          this.votes = data.data.infos;
          this.total = data.data.total;
        }
      });
  }
  /*删除投票信息*/
  delete(id){
    confirmFunc.init({
      'title': '提示',
      'mes': '是否删除该条投票信息?',
      'popType': 1,
      'imgType': 3,
      'callback': () => {
        this.publicresourceVoteService.deleteVoteInfo(id)
          .subscribe(data => {
            if (this.errorResponseService.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': data.msg,
                'popType': 2,
                'imgType': 1,
              });
              this.getVotes(1);
            }
          });
      }
    })
  }
  /*发布信息*/
  changePush(id,status) {
    confirmFunc.init({
      'title': '提示',
      'mes': '是否发布该条投票信息?',
      'popType': 1,
      'imgType': 3,
      'callback': () => {
        let postdata = new Vote();
        postdata.id = id;
        postdata.status = status;
        this.publicresourceVoteService.updateVoteStatus(postdata)
          .subscribe(data => {
            if (this.errorResponseService.errorMsg(data)) {
              confirmFunc.init({
                'title': '提示',
                'mes': data.msg,
                'popType': 2,
                'imgType': 1,
              });
              this.getVotes(1);
            }
          });

      }
    });
  }
}
