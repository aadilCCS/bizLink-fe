import { Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login/login.component';
import { RegisterComponent } from './modules/auth/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/noAuth.guard';

export const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "sign-in", component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: "register", component: RegisterComponent, canActivate: [NoAuthGuard] },
  {
    path: "home",
    // canActivate: [AuthGuard],
    loadChildren: () => import("./modules/home/home.module").then((m) => m.HomeModule)
  },
  {
    path: "shop",
    // canActivate: [AuthGuard],
    loadChildren: () => import("./modules/shop/shop.module").then((m) => m.ShopModule),
  },
  {
    path: "profile",
    canActivate: [AuthGuard],
    loadChildren: () => import("./modules/profile/profile.module").then((m) => m.ProfileModule),
  },
  {
    path: "cart",
    canActivate: [AuthGuard],
    loadChildren: () => import("./modules/cart/cart.module").then((m) => m.CartModule),
  },
  {
    path: "checkout",
    canActivate: [AuthGuard],
    loadChildren: () => import("./modules/checkout/checkout.module").then((m) => m.CheckoutModule),
  },
  {
    path: "wishlist",
    canActivate: [AuthGuard],
    loadChildren: () => import("./modules/wishlist/wishlist.module").then((m) => m.WishlistModule),
  },
  {
    path: "buyer-list",
    canActivate: [NoAuthGuard],
    loadChildren: () => import("./modules/buyer-list/buyer-list.module").then((m) => m.BuyerListModule),
  },
  {
    path: "seller",
    // canActivate: [NoAuthGuard],
    loadChildren: () => import("./modules/seller-list/seller-list.module").then((m) => m.SellerListModule),
  },
  { path: "**", redirectTo: "home" }
];
