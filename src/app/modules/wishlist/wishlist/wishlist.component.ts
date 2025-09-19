import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MaterialsModule } from 'app/materials/materials.module';
import { Product } from 'app/models/product';
import { Wishlist } from 'app/models/wishlist';
import { BreadCrumbComponent } from 'app/modules/shared/bread-crumb/bread-crumb.component';
import { SecureImagePipe } from 'app/pipe/secure-image.pipe';
import { ProductService } from 'app/service/product.service';
import { UtilService } from 'app/service/util.service';
import { WishlistService } from 'app/service/wishlist.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { BarRatingModule, BarRatingEffect } from 'ngx-bar-rating';
import { GlobalService } from 'app/service/global.service';
import { AddToCartService } from 'app/service/add-to-cart.service';

@Component({
  selector: 'app-wishlist',
  imports: [
    CommonModule,
    SecureImagePipe,
    MaterialsModule,
    BreadCrumbComponent,
    NgxSkeletonLoaderModule,
    BarRatingModule,
    BarRatingEffect,
  ],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent implements OnInit {
  newArrivalList: Product | any = null;
  wishList: Wishlist | any = null;

  constructor(
    private _router: Router,
    private _productService: ProductService,
    private _wishlistService: WishlistService,
    private _utilService: UtilService,
    private _matSnackBar: MatSnackBar,
    public _globalService: GlobalService,
    public _addToCartService: AddToCartService,
  ) { }

  ngOnInit(): void {
    this.getNewArrivals(null);
    this.getWishlist();
  }

  async getWishlist() {
    try {
      const response = await this._wishlistService.getWishlist(this.filterParams());
      this.wishList = response;
      if (this.wishList && this.wishList.length > 0) {
        this.wishList.forEach((product: any) => {
          if (product?.productId?.model && product?.productId?.model.length > 0) {
            product.productId?.model.forEach((model: any) => {
              const price1 = model.moqs[0]?.price ?? null;
              const price2 = model.moqs[1]?.price ?? null;
              if (price2 && price2 !== price1) {
                product.productId.priceRange = `${price1} - ${price2}`;
              } else {
                product.productId.priceRange = `${price1}`;
              }
              product.productId.minOrder = model.moqs[0]?.min;
            });
          }
        });
      }
    } catch (error) {
      console.log(error)
    }
  };

  filterParams(categoryId?: string | null): HttpParams {
    let params = new HttpParams();
    if (categoryId) {
      params = params.append('subCategory', categoryId);
    }
    params = params.append('limit', 6);
    return params;
  }

  async getNewArrivals(value: string | null) {
    try {
      this.newArrivalList = await this._productService.getProductsFiltered(this.filterParams(value));
      const wishlist = await this._wishlistService.getWishlistAll(this.filterParams());
      const cartItem: any = await this._addToCartService.getCartItem();
      setTimeout(() => {
        this.newArrivalList.items.forEach((product: any) => {
          product['isWishlisted'] = false;
          product['isAddToCart'] = false;
          wishlist.forEach((wish: any) => {
            if (wish.productId && wish.productId.id === product.id) {
              product['isWishlisted'] = true;
            }
          });
          cartItem.forEach((cart: any) => {
            if (cart.productId && cart.productId.id === product.id) {
              product['isAddToCart'] = true;
            }
          });
          product.model.forEach((model: any) => {
            const price1 = model.moqs[0]?.price ?? null;
            const price2 = model.moqs[1]?.price ?? null;
            if (price2 && price2 !== price1) {
              product.priceRange = `${price1} - ${price2}`;
            } else {
              product.priceRange = `${price1}`;
            }
            product.minOrder = model.moqs[0]?.min;
          });
        });
      }, 2000);
    } catch (error: any) {
      this._utilService.showErrorSnack(this._matSnackBar, error.message);
    }
  };

  async removeWishlistItem(wishlistId: string) {
    try {
      await this._wishlistService.deleteWishlist(wishlistId);
      this._utilService.headerCount();
      this.getWishlist();
      this._utilService.showSuccessSnack(this._matSnackBar, 'Item removed from wishlist successfully');
    } catch (error: any) {
      this._utilService.showErrorSnack(this._matSnackBar, error.error.message);
    }
  }

  goTo(path: string) {
    this._router.navigate([path]);
  }
}
