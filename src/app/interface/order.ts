import {OrderPosition} from "./order-position";

export interface Order {
  id: string;
  orderState: string;
  products: OrderPosition[];
  instant: Date
}
