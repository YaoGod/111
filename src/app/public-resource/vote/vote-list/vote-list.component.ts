import { Component, OnInit } from '@angular/core';
import {Vote} from "../../../mode/vote/vote.service";
import {PublicresourceVoteService} from "../../../service/publicresource-vote/publicresource-vote.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";

@Component({
  selector: 'app-vote-list',
  templateUrl: './vote-list.component.html',
  styleUrls: ['./vote-list.component.css']
})
export class VoteListComponent implements OnInit {

  public pageNo;
  public pageSize = 6;
  public total = 0;
  public votesTop: Array<any>;
  public votes: Array<any>;
  public wrapVotes: Array<any>;
  public search: Vote;
  constructor(
    private publicresourceVoteService:PublicresourceVoteService,
    private errorResponseService:ErrorResponseService
  ) { }

  ngOnInit() {
    this.search = new Vote();
    this.votes = [];
    this.votesTop = [];
    this.wrapVotes = [];
    this.votesTop = [
      {
        title: '碰到这样的司机，你会怎么做？',
        content: ''
      },
      {
        title: '你最想娶(嫁)的金庸小说人物？'
      },
      {
        title: '谁是你心中未来的大师？'
      },
      {
        title: '这两天，社交网络都被成都男子暴打女司机事件及其后续刷屏了，' +
        '朋友圈也都分成了两大阵营，意见不合的双方仿佛自己就是当事人。当在路上碰到这样的司机你会怎么做？'
      }
    ];
    this.getVoteList(1);
    this.getVoteCharts();
  }

  getVoteList(pageNo){
    this.pageNo = pageNo;
    this.publicresourceVoteService.getVoteList(this.pageNo,this.pageSize,this.search)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.votes = data.data.infos;
          this.wrapVotes = data.data.infos;
          this.total = data.data.total;
        }
      })
  }
  /*获取热门投票*/
  getVoteCharts(){
    this.publicresourceVoteService.getVoteCharts()
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.votesTop = data.data;
        }
      })
  }
}
