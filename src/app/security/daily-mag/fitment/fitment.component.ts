import { Component, OnInit } from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';

import * as $ from 'jquery';
/*import '../../../../assets/js/confirmFunc.js';*/

declare var $: any;
declare var confirmFunc: any;

@Component({
  selector: 'app-fitment',
  templateUrl: './fitment.component.html',
  styleUrls: ['./fitment.component.css']
})
export class FitmentComponent implements OnInit {

  constructor(private http: Http) { }

  ngOnInit() {

  }

}
