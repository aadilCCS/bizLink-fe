import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule, Routes } from '@angular/router';
import { ShopComponent } from './shop/shop.component';
import { ProdcutDetailComponent } from './prodcut-detail/prodcut-detail.component';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { BarRatingModule } from 'ngx-bar-rating';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

const routes: Routes = [
  { path: "", component: ShopComponent },
  { path: ":id", component: ShopComponent },
  { path: "product-details/:id", component: ProdcutDetailComponent },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ShopComponent,
    ProdcutDetailComponent,
    NgxImageZoomModule,
    RouterLink,
    NgxSkeletonLoaderModule.forRoot(),
    BarRatingModule ,
    NgxSliderModule,
    RouterModule.forChild(routes),
  ]
})
export class ShopModule { }
