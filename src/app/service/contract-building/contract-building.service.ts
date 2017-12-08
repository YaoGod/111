import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { IpSettingService } from '../ip-setting/ip-setting.service';
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
    private ipSetting  : IpSettingService
  ) { }
  /*获取当前合同*/
  getContractInfo(id,type) {
    const url = this.ipSetting.ip + '/building/contract/getContractInfo/' + id + '/' + type;
    return this.http.get(url, this.options)
      .map(res => res.json());
  }
  /*获取历史合同列表*/
  getContractList(id,type,pageNo,pageSize) {
    const url = this.ipSetting.ip + '/building/contract/getContractList/'
      + id + '/' + type+ '/'+pageNo+ '/' + pageSize;
    return this.http.get(url, this.options)
      .map(res => res.json());
  }
  /*新增房屋合同*/
  addContract(data:any,path:string){
    let url = '';
    if(path === 'build') {
      url = this.ipSetting.ip + '/building/contract/addBuildContract';
    }else if(path === 'buy') {
      url = this.ipSetting.ip + '/building/contract/addBuyContract';
    }else if(path === 'lease') {
      url = this.ipSetting.ip + '/building/contract/addLeaseContract';
    }else if(path === 'property'){
      url = this.ipSetting.ip + '/building/contract/addPropertyContract';
    }
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
  /*更新合同信息*/
  updateContract(data:any,path:string){
    let url = '';
    if(path === 'build') {
      url = this.ipSetting.ip + '/building/contract/updateBuildContract';
    }else if(path === 'buy') {
      url = this.ipSetting.ip + '/building/contract/updateBuyContract';
    }else if(path === 'lease') {
      url = this.ipSetting.ip + '/building/contract/updateLeaseContract';
    }else if(path === 'property'){
      url = this.ipSetting.ip + '/building/contract/updatePropertyContract';
    }
    return this.http.post(url,data,this.options)
      .map(res => res.json());
  }
  deleteContract(id,type){
    const url = this.ipSetting.ip + '/building/contract/deleteContract/'+id+'/'+type;
    return this.http.get(url, this.options)
      .map(res => res.json());
  }
}
