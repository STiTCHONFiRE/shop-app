import {Component, HostListener, OnInit} from '@angular/core';
import {OrderService} from "../service/order.service";
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  startWith,
  Subject,
  switchMap
} from "rxjs";
import {Order} from "../interface/order";
import {HttpErrorResponse} from "@angular/common/http";
import {OrderPosition} from "../interface/order-position";
import {AdminService} from "../service/admin.service";
import {Position} from "../interface/position";
import {Type} from "../interface/type";

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss']
})
export class AdminOrdersComponent implements OnInit {
  page$ = new BehaviorSubject<number>(0);
  ordersArr$ = new BehaviorSubject<Order[]>([]);
  orders$: Observable<{ appState: string; appErr?: HttpErrorResponse }>
  update$: Subject<[string, Order]> = new Subject()
  hasNext = true;
  isLoading = true;
  orderStates: Type[] = [
    {name: "формирование", tp: "FORMATION"},
    {name: "в пути", tp: "ON_THE_WAY"},
    {name: "ожидает получения", tp: "AWAITING_RECEIPT"},
    {name: "завершен", tp: "DONE"},
    {name: "отменен", tp: "CANCELED"}
  ];

  constructor(private adminService: AdminService) {
  }

  ngOnInit(): void {
    this.orders$ = this.page$.pipe(
      switchMap((value) =>
        this.adminService.allOrders$(value).pipe(
          map((response) => {
            this.ordersArr$.next(
              [...this.ordersArr$.value, ...response]
            );

            if (response.length < 5) {
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

    this.update$.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe((x) => {
      this.adminService.updateOrder$(x[0], x[1].id).subscribe(() => {
        x[1].orderState = x[0]
      });
    });
  }

  onChangeState(orderState: string, order: Order) {
    this.update$.next([orderState, order])
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

  protected readonly Object = Object;
}
