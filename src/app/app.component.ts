import {Component, OnInit} from '@angular/core';
import {AuthService} from "./service/auth.service";
import {catchError, map, Observable, of, startWith} from "rxjs";
import {Type} from "./interface/type";
import {HttpErrorResponse} from "@angular/common/http";
import {ProductService} from "./service/product.service";
import {Position} from "./interface/position";
import {CartService} from "./service/cart.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  productTypes$: Observable<{ appState: string; appData?: Type[]; err?: HttpErrorResponse; }>
  cart$: Observable<{ appState: string; appData?: Position[]; err?: HttpErrorResponse; }>

  constructor(private authService: AuthService, private productService: ProductService, private cartService: CartService) {
  }

  ngOnInit(): void {
    this.productTypes$ = this.productService.productTypes$().pipe(
      map((response) => {
        return {appData: response, appState: "APP_LOADED"}
      }),
      startWith({appState: "APP_LOADING"}),
      catchError((err: HttpErrorResponse) => of({appState: "APP_ERROR", err}))
    );

    this.cart$ = this.cartService.cart$();
  }

  public clearCart() {
    this.cartService.clearCart$().subscribe();
  }

  public removeFromCart(id: string) {
    this.cartService.removeFromCart$(id).subscribe();
  }

  public isAuth(): boolean {
    return this.authService.isAuth();
  }

  public isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  public login() {
    this.authService.login();
  }

  public logout() {
    this.authService.logout()
  }

  public getSize(): number {
    return this.cartService.size
  }
}
