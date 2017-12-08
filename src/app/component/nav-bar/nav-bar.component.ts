import {Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { Catalog } from '../../mode/catalog/catalog.service';
@Component({
  selector: 'app-nav',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  @Input() navs: Array<Catalog>;
  public active;
  constructor(
    private router:Router
  ) { }

  ngOnInit() {
    this.active = 0;
  }
  slide(index:number){
    this.active = index;
  }
}
