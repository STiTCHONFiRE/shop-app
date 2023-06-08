import {AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ProductService} from "../service/product.service";
import {
  BehaviorSubject,
  catchError,
  fromEvent,
  map,
  Observable,
  of, scan,
  startWith,
  Subject,
  switchMap,
  takeUntil, tap
} from "rxjs";
import {Product} from "../interface/product";
import {HttpErrorResponse} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../service/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CartService} from "../service/cart.service";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {
  @Input() filter: string;
  currentPage$: BehaviorSubject<number>;
  products$: Observable<{ appState: string; appData?: Product[]; err?: HttpErrorResponse; }>;
  private ngUnsubscribe = new Subject<void>();
  searchForm: FormGroup;
  products: Product[] = [];
  loading: boolean = false;
  hasNext: boolean = true;

  constructor(private productService: ProductService,
              private authService: AuthService,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private cartService: CartService,
  ) {
  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe(results => {
      this.searchForm = this.fb.group({
        search: [this.filter, Validators.required]
      });
      this.loading = true;
      this.hasNext = true;
      this.products = [];
      this.currentPage$ = new BehaviorSubject<number>(0);
      this.loadPage(results["type"]);
    })
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (this.isScrollAtBottom() && this.hasNext && !this.loading) {
      this.loading = true;
      this.currentPage$.next(this.currentPage$.value + 1)
    }
  }

  isScrollAtBottom(): boolean {
    const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;
    return windowBottom >= docHeight;
  }



  private loadPage(type: string) {
    this.products$ = this.currentPage$.pipe(
      switchMap((page) => this.productService.products$(this.filter, type, page).pipe(
        map((response) => {
          this.loading = false;

          if (response.length < 5) {
            this.hasNext = false;
          }

          response.forEach(x => this.products.push(x));
          return {appData: response, appState: "APP_LOADED"}
        }),
        startWith({ appState: "APP_LOADING" }),
        catchError((err: HttpErrorResponse) => of({appState: "APP_ERROR", err}))
      )),
    )
  }

  public isContaining(id: string): boolean {
    return this.cartService.contains(id);
  }

  public addToCart(id: string) {
    this.cartService.addToCart$(id).subscribe();
  }

  public removeFromCart(id: string) {
    this.cartService.removeFromCart$(id).subscribe();
  }

  onSendData() {
    const type: string = this.route.snapshot.paramMap.get("type");
    this.filter = this.searchForm.get("search").value;

    this.loading = true
    this.hasNext = true;
    this.products = []
    this.currentPage$ = new BehaviorSubject<number>(0);

    this.products$ = this.currentPage$.pipe(
      switchMap((page) => this.productService.products$(this.filter, type, page).pipe(
        map((response) => {
          this.loading = false;

          if (response.length < 5) {
            this.hasNext = false;
          }

          response.forEach(x => this.products.push(x));
          return {appData: response, appState: "APP_LOADED"}
        }),
        startWith({ appState: "APP_LOADING" }),
        catchError((err: HttpErrorResponse) => of({appState: "APP_ERROR", err}))
      )),
    )
  }

  public isAuth(): boolean {
    return this.authService.isAuth();
  }

  public login() {
    this.authService.login();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
