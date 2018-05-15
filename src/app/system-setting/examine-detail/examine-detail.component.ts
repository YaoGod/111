import { Component, OnInit } from '@angular/core';
import {Review} from "../../service/workflow/workflow.service";

@Component({
  selector: 'app-examine-detail',
  templateUrl: './examine-detail.component.html',
  styleUrls: ['./examine-detail.component.css']
})
export class ExamineDetailComponent implements OnInit {

  public search :Review;
  public pageNo: number;
  public pageSize: number;
  public total: number;
  public msg: Review;
  public history: Array<Review>;
  constructor() { }

  ngOnInit() {
    this.pageNo = 1;
    this.pageSize = 10;
    this.total = 0;
    this.search = new Review();
    this.msg = new Review();
    this.history = [];
  }

}
