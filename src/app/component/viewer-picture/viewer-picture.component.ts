import { Component, OnInit } from '@angular/core';
declare var $ :any;
@Component({
  selector: 'app-viewer-picture',
  templateUrl: './viewer-picture.component.html',
  styleUrls: ['./viewer-picture.component.css']
})
export class ViewerPictureComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    let $host;
    $host = $('[mag-thumb="drag"]');
    $host.mag();
  }

}
