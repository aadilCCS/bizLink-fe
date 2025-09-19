import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule, Routes } from '@angular/router';
import { WishlistComponent } from './wishlist/wishlist.component';

const routes: Routes = [
  { path: "", component: WishlistComponent },
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    WishlistComponent,
    RouterLink,
    RouterModule.forChild(routes),
  ]
})
export class WishlistModule { }
