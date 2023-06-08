import {Product} from "./product";
import {Review} from "./review";

export interface OrderPosition {
  n: number;
  serialCode: string;
  product: Product;
  review: Review;
}
