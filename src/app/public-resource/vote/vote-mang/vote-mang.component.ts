import { Component, OnInit } from '@angular/core';
import {Vote} from "../../../mode/vote/vote.service";

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
  constructor() { }

  ngOnInit() {
    this.votes = [];
    this.search = new Vote();
  }
  getVotes(pageNo: number){
    this.pageNo = pageNo;
  }

}
