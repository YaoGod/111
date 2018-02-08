import { Injectable } from '@angular/core';

@Injectable()
export class GroupCart{
  productId:number;
  id:number;
  userId: string;
  name: string;
  imgPath: string;
  price:number;
  quantity:number;
  ckecked: string;
  detail: string;
  totalPrice:number;
  constructor() { }

}
