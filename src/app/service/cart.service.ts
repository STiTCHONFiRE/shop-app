import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Position} from "../interface/position";
import {BehaviorSubject, catchError, first, map, of, startWith, switchMap, tap} from "rxjs";
import {Update} from "../interface/update";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly SERVER_URL: string = "http://localhost:8081/api/v1/users";
  private event$ = new BehaviorSubject(true);
  private responseSubject$ = new BehaviorSubject<Position[]>(null);

  constructor(private httpClient: HttpClient) {
  }

  cart$ = () => this.event$.pipe(
    switchMap(() =>
      this.httpClient.get<Position[]>(`${this.SERVER_URL}/cart`).pipe(
        map((response) => {
          this.responseSubject$.next(response)
          return {appData: response, appState: "APP_LOADED"}
        }),
        startWith(this.responseSubject$.value ? {
          appState: "APP_LOADED",
          appData: this.responseSubject$.value
        } : {appState: "APP_LOADING"}),
        catchError((err: HttpErrorResponse) => of({appState: "APP_ERROR", err})),
      )
    ),
  );

  addToCart$ = (id: string) => this.httpClient.put(`${this.SERVER_URL}/cart/add`, {productId: id}).pipe(
    tap(() => this.event$.next(this.event$.value)),
    first()
  );

  clearCart$ = () => this.httpClient.delete(`${this.SERVER_URL}/cart/clear`).pipe(
    tap(() => this.event$.next(true)),
    first()
  )

  removeFromCart$ = (id: string) => this.httpClient.delete(`${this.SERVER_URL}/cart/remove`, {body: {id: id}}).pipe(
    tap(() => this.event$.next(true)),
    first()
  )

  updateCart$ = (id: string, n: number) => this.httpClient.post<Update>(`${this.SERVER_URL}/cart/update`, {
    id: id,
    n: n
  }).pipe(
    first()
  )

  public update() {
    this.event$.next(true);
  }

  public contains(id: string): boolean {
    return this.responseSubject$.value?.map(p => p.product.id).indexOf(id) > -1
  }

  public get size(): number {
    return this.responseSubject$.value?.length;
  }
}
