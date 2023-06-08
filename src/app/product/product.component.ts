import {Component, OnInit} from '@angular/core';
import {catchError, map, Observable, of, startWith} from "rxjs";
import {Product} from "../interface/product";
import {HttpErrorResponse} from "@angular/common/http";
import {ProductService} from "../service/product.service";
import {ActivatedRoute, Router} from "@angular/router";
import 'hammerjs';
import {NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions} from "ngx-gallery-15";
import {AuthService} from "../service/auth.service";
import {CartService} from "../service/cart.service";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  product$: Observable<{ appState: string; appData?: Product; err?: HttpErrorResponse; }>
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[] = [];
  bottomState: string;

  constructor(private productService: ProductService, private route: ActivatedRoute, private authService: AuthService, private cartService: CartService) {
  }

  public addToCart(id: string) {
    this.cartService.addToCart$(id).subscribe();
  }

  public removeFromCart(id: string) {
    this.cartService.removeFromCart$(id).subscribe();
  }

  public isContaining(id: string): boolean {
    return this.cartService.contains(id);
  }

  ngOnInit(): void {
    this.bottomState = "REVIEWS"
    const id: string = this.route.snapshot.paramMap.get("id");

    this.product$ = this.productService.product$(id).pipe(
      map((response) => {
        this.loadGallery(response);
        return {appData: response, appState: "APP_LOADED"}
      }),
      startWith({appState: "APP_LOADING"}),
      catchError((err: HttpErrorResponse) => of({appState: "APP_ERROR", err}))
    )
  }

  public setReviews() {
    this.bottomState = "REVIEWS";
  }

  public setCharacteristics() {
    this.bottomState = "CHARACTERISTICS";
  }

  public getUser() {
    return this.authService.getUser();
  }

  public isLogin() {
    return this.authService.isAuth();
  }

  public login() {
    this.authService.login();
  }

  private loadGallery(response: Product) {
    this.galleryOptions = [
      {
        //width: '300px',
        //height: '200px',
        previewCloseOnClick: true,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide
      },
      // max-width 800
      {
        breakpoint: 800,
        //width: '100%',
       // height: '600px',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20
      }
      // max-width 400
    ];

    for (let imageUrl of response.imagesIds) {
      this.galleryImages.push({
        small: "http://localhost:8081/api/v1/products/public/images/" + imageUrl,
        big: "http://localhost:8081/api/v1/products/public/images/" + imageUrl,
        medium: "http://localhost:8081/api/v1/products/public/images/" + imageUrl
      })
    }
  }
}
