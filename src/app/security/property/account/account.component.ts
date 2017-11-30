import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  public pageNo     : number;
  public pageSize   : number;
  public pages      : Array<number>;
  constructor() { }

  ngOnInit() {
  }

}
