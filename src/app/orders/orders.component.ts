import {Component, HostListener, OnInit} from '@angular/core';
import {OrderService} from "../service/order.service";
import {BehaviorSubject, catchError, flatMap, map, Observable, of, startWith, switchMap, tap} from "rxjs";
import {Order} from "../interface/order";
import {HttpErrorResponse} from "@angular/common/http";
import {OrderPosition} from "../interface/order-position";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  page$ = new BehaviorSubject<number>(0);
  ordersArr$ = new BehaviorSubject<Order[]>([]);
  orders$: Observable<{ appState: string; appErr?: HttpErrorResponse }>
  ordersActive$: Observable<{ appState: string; appData?: Order[]; appErr?: HttpErrorResponse }>
  hasNext = true;
  isLoading = true;

  constructor(private orderService: OrderService) {
  }

  ngOnInit(): void {
    this.ordersActive$ = this.orderService.ordersActive$().pipe(
      map((response) => {
        return {appState: "APP_LOADED", appData: response};
      }),
      startWith({appState: "APP_LOADING"}),
      catchError((err: HttpErrorResponse) => of({appState: "APP_ERROR", appErr: err}))
    )
    this.orders$ = this.page$.pipe(
      switchMap((value) =>
        this.orderService.ordersHistory$(value).pipe(
          map((response) => {
            this.ordersArr$.next(
              [...this.ordersArr$.value, ...response]
            );

            if (response.length < 3) {
              this.hasNext = false;
            }

            this.isLoading = false;
            return {appState: "APP_LOADED"};
          }),
          startWith({appState: "APP_LOADING"}),
          catchError((err: HttpErrorResponse) => of({appState: "APP_ERROR", appErr: err}))
        )
      )
    );
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (this.isScrollAtBottom() && this.hasNext && !this.isLoading) {
      this.isLoading = true;
      this.page$.next(this.page$.value + 1);
    }
  }

  private isScrollAtBottom(): boolean {
    const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;
    return windowBottom >= docHeight;
  }

  public getSum(products: OrderPosition[]): number {
    let sum: number = 0;
    for (let product of products) {
      sum += product.n * product.product.price;
    }

    return sum;
  }
}
