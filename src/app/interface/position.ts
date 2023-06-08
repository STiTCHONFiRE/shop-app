import {Product} from "./product";

export interface Position {
  n: number;
  product: Product;
  max: number;
  isAvailable: boolean;
}
