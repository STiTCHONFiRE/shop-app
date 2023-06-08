import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CartService} from "../service/cart.service";
import {debounceTime, distinctUntilChanged, Observable, Subject} from "rxjs";
import {Position} from "../interface/position";
import {HttpErrorResponse} from "@angular/common/http";
import {AuthService} from "../service/auth.service";
import {OrderService} from "../service/order.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  cart$: Observable<{ appState: string; appData?: Position[]; err?: HttpErrorResponse; }>
  state: Subject<[number, Position]> = new Subject<[number, Position]>();

  constructor(private cartService: CartService, private orderService: OrderService, private router: Router) {
  }

  ngOnInit(): void {
    this.cart$ = this.cartService.cart$().pipe();
    this.state.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe((x) => {
      this.cartService.updateCart$(x[1].product.id, x[0]).subscribe((update) => {
        console.log(update.n)
        x[1].n = update.n;
        x[1].isAvailable = update.isAvailable;
      });
    })
  }

  public createOrder() {
    this.orderService.orderCreate$().subscribe((response) => {
      this.router.navigate(["/orders", response.id]).then(() => this.cartService.update())
    })
  }

  onInputChange(event: any, position: Position) {
    console.log(event.target.value)
    this.state.next([event.target.value, position])
  }

  public removeFromCart(id: string) {
    this.cartService.removeFromCart$(id).subscribe();
  }

  public clearCart() {
    this.cartService.clearCart$().subscribe();
  }

  public getSum(positions: Position[]): number {
    let sum: number = 0;
    positions
      .filter(position => position.isAvailable)
      .forEach(position => sum += position.n * position.product.price);

    return sum;
  }

  public validate(positions: Position[]): boolean {
    return positions.filter(x => x.isAvailable).length == 0
  }

  ngOnDestroy(): void {
    this.state.complete();
  }
}
