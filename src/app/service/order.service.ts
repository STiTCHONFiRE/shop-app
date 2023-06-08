import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Order} from "../interface/order";
import {first, tap} from "rxjs";
import {CartService} from "./cart.service";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly SERVER_URL: string = "http://localhost:8081/api/v1/orders";

  constructor(private httpClient: HttpClient) { }

  ordersActive$ = () => this.httpClient.get<Order[]>(`${this.SERVER_URL}`);

  ordersHistory$ = (page: number = 0) => this.httpClient.get<Order[]>(`${this.SERVER_URL}/history?page=${page}`);

  order$ = (id: string) => this.httpClient.get<Order>(`${this.SERVER_URL}/${id}`);

  orderCreate$ = () => this.httpClient.post<Order>(`${this.SERVER_URL}/create`, null).pipe(
    first()
  );
}
