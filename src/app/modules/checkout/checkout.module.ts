import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule, Routes } from '@angular/router';
import { CheckoutComponent } from './checkout/checkout.component';


const routes: Routes = [
  { path: "", component: CheckoutComponent },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CheckoutComponent,
    RouterLink,
    RouterModule.forChild(routes),
  ]
})
export class CheckoutModule { }
