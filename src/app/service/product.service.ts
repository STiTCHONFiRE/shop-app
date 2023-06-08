import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Product} from "../interface/product";
import { Type } from '../interface/type';
import {catchError, map, of, startWith} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly SERVER_URL: string = "http://localhost:8081/api/v1/products"

  constructor(private httpClient: HttpClient) { }

  product$ = (id: string) => this.httpClient.get<Product>(`${this.SERVER_URL}/details/${id}`)
  createdProduct$ = (formData: FormData) => this.httpClient.post<Product>(`${this.SERVER_URL}/create`, formData);
  productTypes$ = () => this.httpClient.get<Type[]>(`${this.SERVER_URL}/types`);

  products$ = (filter: string = '', type: string = null, page: number) => {
    if (type)
      return this.httpClient.get<Product[]>(`${this.SERVER_URL}/${type}?filter=${filter}&page=${page}`);

    return this.httpClient.get<Product[]>(`${this.SERVER_URL}?filter=${filter}&page=${page}`);
  }
}
