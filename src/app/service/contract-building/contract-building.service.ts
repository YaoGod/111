import { Injectable } from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';
@Injectable()
export class ContractBuildingService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private options =  new RequestOptions({
    headers: this.headers,
    withCredentials: true
  });
  constructor(
    private http: Http,
  ) { }
  getContractInfo(id,type){
    const url = '/proxy/building/contract/getContractInfo/'+id+'/'+type;
    return this.http.get(url,this.options)
      .map(res => res.json());
  }
}
