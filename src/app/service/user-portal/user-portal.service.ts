import { Injectable } from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';
@Injectable()
export class UserPortalService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private options =  new RequestOptions({
    headers: this.headers,
    withCredentials: true
  });
  constructor(
    private http: Http,
  ) { }
  portalLogin (data) {
    const url = '/proxy/portal/user/userLogin';
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
}
