import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
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
  /*获取当前合同*/
  getContractInfo(id,type) {
    const url = '/proxy/building/contract/getContractInfo/' + id + '/' + type;
    return this.http.get(url, this.options)
      .map(res => res.json());
  }
  /*获取历史合同列表*/
  getContractList(id,type,pageNo,pageSize) {
    const url = '/proxy/building/contract/getContractList/'
      + id + '/' + type+ '/'+pageNo+ '/' + pageSize;
    return this.http.get(url, this.options)
      .map(res => res.json());
  }
}
