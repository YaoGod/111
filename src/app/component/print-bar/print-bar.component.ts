import {Component, Input, OnChanges, EventEmitter,OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-print-bar',
  templateUrl: './print-bar.component.html',
  styleUrls: ['./print-bar.component.css']
})
export class PrintBarComponent implements OnChanges {

  @Input() title:string;
  @Input() formData:any;

  constructor(
    private router:Router
  ) { }

  ngOnChanges() {

  }
  print(){
    let oldstr =window.document.body.innerHTML;
    let newstr = document.getElementById("print").innerHTML;
    document.body.innerHTML =newstr;
    window.print();
    document.body.innerHTML = oldstr;
    location.reload();
  }
}
