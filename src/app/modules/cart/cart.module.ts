import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule, Routes } from '@angular/router';
import { CartComponent } from './cart/cart.component';

const routes: Routes = [
  { path: "", component: CartComponent },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CartComponent,
    RouterLink,
    RouterModule.forChild(routes),
  ]
})
export class CartModule { }
