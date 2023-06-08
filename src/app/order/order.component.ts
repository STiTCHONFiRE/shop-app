import {Component, OnInit} from '@angular/core';
import {OrderService} from "../service/order.service";
import {catchError, map, Observable, of, startWith} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {Order} from "../interface/order";
import {ActivatedRoute} from "@angular/router";
import {OrderPosition} from "../interface/order-position";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  order$: Observable<{ appState: string; appData?: Order; err?: HttpErrorResponse; }>

  constructor(private orderService: OrderService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const id: string = this.route.snapshot.paramMap.get("id");

    this.order$ = this.orderService.order$(id).pipe(
      map((response) => {
        return {appData: response, appState: "APP_LOADED"}
      }),
      startWith({appState: "APP_LOADING"}),
      catchError((err: HttpErrorResponse) => of({appState: "APP_ERROR", err}))
    )
  }

  public getSum(products: OrderPosition[]): number {
    let sum: number = 0;
    for (let product of products) {
      sum += product.n * product.product.price;
    }

    return sum;
  }
}
