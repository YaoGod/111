import { Component, OnInit } from '@angular/core';
import {Vote} from "../../../mode/vote/vote.service";
import {PublicresourceVoteService} from "../../../service/publicresource-vote/publicresource-vote.service";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {GlobalCatalogService} from "../../../service/global-catalog/global-catalog.service";

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
  public rule;
  constructor(
    private globalCatalogService: GlobalCatalogService,
    private publicresourceVoteService:PublicresourceVoteService,
    private errorResponseService:ErrorResponseService
  ) {
    this.rule = this.globalCatalogService.getRole("publicResource/vote");
  }

  ngOnInit() {
    this.globalCatalogService.valueUpdated.subscribe(
      (val) =>{
      this.rule = this.globalCatalogService.getRole("publicResource/vote");
    });
    this.search = new Vote();
    this.votes = [];
    this.votesTop = [];
    this.wrapVotes = [];
    this.getVoteList(1);
    this.getVoteCharts();
  }
  getVoteList(pageNo){
    this.pageNo = pageNo;
    this.publicresourceVoteService.getVoteList(this.pageNo,this.pageSize,this.search)
      .subscribe(data=>{
        if(this.errorResponseService.errorMsg(data)){
          this.votes = data.data.infos;
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
          this.wrapVotes = data.data;
        }
      })
  }
}
