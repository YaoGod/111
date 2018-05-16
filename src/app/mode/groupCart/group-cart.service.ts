import { Injectable } from '@angular/core';

@Injectable()
export class GroupCart{
  productId:number;
  id:number;
  userId: string;
  name: string;
  imgPath: any;
  price:number;
  quantity:number;
  ckecked: string;
  detail: string;
  totalPrice:number;
  shipping:string;
  constructor() { }

}
