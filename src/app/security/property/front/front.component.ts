import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-front',
  templateUrl: './front.component.html',
  styleUrls: ['./front.component.css']
})
export class FrontComponent implements OnInit {

  public types : any = "";
  public watchType : boolean = true;
  constructor(
    private router : Router
  ) { }

  ngOnInit() {
  }
  /*跳转到类型列表*/
  linkType() {
    if(this.types === "0") {
      this.router.navigate(["/hzportal/security/property/type"]);
    }
  }
}
