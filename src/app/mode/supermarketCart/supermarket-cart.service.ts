import { Injectable } from '@angular/core';
import {SupermarketProduct} from "../supermarketProduct/supermarket-product.service";

@Injectable()
export class SupermarketCart {

  productId:number;
  id:number;
  userId: string;
  quantity:number;
  ckecked: string;
  totalPrice:number;
  product:SupermarketProduct;

  constructor() { }

}
