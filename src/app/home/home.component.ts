import {Component, OnInit} from '@angular/core';
import {catchError, map, Observable, of, startWith} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {Type} from "../interface/type";
import {ProductService} from "../service/product.service";
import {AuthService} from "../service/auth.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  productTypes$: Observable<{ appState: string; appData?: Type[]; err?: HttpErrorResponse; }>
  state: string;
  filter: string;
  constructor(private productService: ProductService, private authService: AuthService) {
    this.state = "SELECTING";
  }

  ngOnInit(): void {
    this.productTypes$ = this.productService.productTypes$().pipe(
      map((response) => {
        return {appData: response, appState: "APP_LOADED"}
      }),
      startWith({appState: "APP_LOADING"}),
      catchError((err: HttpErrorResponse) => of({appState: "APP_ERROR", err}))
    );
  }

  onSendData(filter: string) {
    this.filter = filter;
    this.state = "SEARCHING";
  }
}
