import {APP_INITIALIZER, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductsComponent } from './products/products.component';
import { NewProductComponent } from './new-product/new-product.component';
import { HomeComponent } from './home/home.component';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { ProductComponent } from './product/product.component';
import {OAuthModule} from "angular-oauth2-oidc";
import {NgxGalleryModule} from "ngx-gallery-15";
import {AngularEditorModule} from "@kolkov/angular-editor";
import { SafePipe } from './pipe/safe.pipe';
import {AuthService} from "./service/auth.service";
import { ProfileComponent } from './profile/profile.component';
import { CartComponent } from './cart/cart.component';
import { OrderComponent } from './order/order.component';
import { OrdersComponent } from './orders/orders.component';
import { AdminOrdersComponent } from './admin-orders/admin-orders.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { ReviewComponent } from './review/review.component';
import { OrderPositionComponent } from './order-position/order-position.component';

const appInitializerFn = (authService: AuthService) => {
  return () => {
    return authService.loadConfig();
  };
};

@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    NewProductComponent,
    HomeComponent,
    ProductComponent,
    SafePipe,
    ProfileComponent,
    CartComponent,
    OrderComponent,
    OrdersComponent,
    AdminOrdersComponent,
    ReviewsComponent,
    ReviewComponent,
    OrderPositionComponent,
  ],
  imports: [
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: ['http://localhost:8081/'],
        sendAccessToken: true
      }
    }),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgxGalleryModule,
    AngularEditorModule
  ],
  providers: [
    AuthService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: [AuthService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
