import { Injectable } from '@angular/core';
import { RequestOptions, Headers} from '@angular/http';

@Injectable()
export class IpSettingService {

  private headers = new Headers({'Content-Type': 'application/json'});
  public options =  new RequestOptions({
    headers: this.headers,
    withCredentials: true
  });
  /* nginx */
  public ip = "/proxy";
  /*set ip and port for personal*/
 /* public ip = "http://10.71.246.83:8080";*/
}
