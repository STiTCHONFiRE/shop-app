import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {NewProductComponent} from "./new-product/new-product.component";
import {ProductsComponent} from "./products/products.component";
import {ProductComponent} from "./product/product.component";
import {ProfileComponent} from "./profile/profile.component";
import {CartComponent} from "./cart/cart.component";
import {adminGuard, authGuard} from "./auth.guard";
import {OrderComponent} from "./order/order.component";
import {OrdersComponent} from "./orders/orders.component";
import {AdminOrdersComponent} from "./admin-orders/admin-orders.component";

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "products/new", component: NewProductComponent, canActivate: [adminGuard]},
  {path: "products", component: ProductsComponent},
  {path: "products/:type", component: ProductsComponent},
  {path: "products/details/:id", component: ProductComponent},
  {path: "profile", component: ProfileComponent, canActivate: [authGuard]},
  {path: "cart", component: CartComponent, canActivate: [authGuard]},
  {path: "orders", component: OrdersComponent, canActivate: [authGuard]},
  {path: "orders/:id", component: OrderComponent, canActivate: [authGuard]},
  {path: "admin/orders", component: AdminOrdersComponent, canActivate: [adminGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
