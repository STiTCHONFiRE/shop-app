import { Injectable } from '@angular/core';
import {Order} from "../interface/order";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private readonly SERVER_URL = "http://localhost:8081/api/v1/admin"

  constructor(private httpClient: HttpClient) { }

  allOrders$ = (page: number = 0) => this.httpClient.get<Order[]>(`${this.SERVER_URL}/orders?page=${page}`);

  updateOrder$ = (orderState: string, id: string) => this.httpClient.post(`${this.SERVER_URL}/orders/${id}?orderState=${orderState}`, null);
}
