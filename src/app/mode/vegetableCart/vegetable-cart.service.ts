import { Injectable } from '@angular/core';

@Injectable()
export class VegetableCart {
  productId:number;
  id:number;
  userId: string;
  vname: string;
  vimage: string;
  price:number;
  quantity:number;
  ckecked: string;
  detail: string;
  totalPrice:number;
  serviceCenter:string;
  constructor() { }

}
