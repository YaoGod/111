import { Component } from '@angular/core';
import { GlobalUserService } from '../service/global-user/global-user.service';
@Component({
  selector: 'app-root',
  templateUrl: './hzportal.component.html',
  styleUrls: ['./hzportal.css']
})
export class HzportalComponent {
  constructor(
    private globalUserService:GlobalUserService) {}
}
