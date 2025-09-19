import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Banner } from 'app/models/banner';
import { Category } from 'app/models/category';
import { Product } from 'app/models/product';
import { SecureImagePipe } from 'app/pipe/secure-image.pipe';
import { CategoryService } from 'app/service/category.service';
import { GlobalService } from 'app/service/global.service';
import { HomeService } from 'app/service/home.service';
import { ProductService } from 'app/service/product.service';
import { UtilService } from 'app/service/util.service';
import { WishlistService } from 'app/service/wishlist.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { BarRatingModule, BarRatingEffect } from 'ngx-bar-rating';
import { Blog } from 'app/models/blog';
import { AddToCartService } from 'app/service/add-to-cart.service';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    SecureImagePipe,
    NgxSkeletonLoaderModule,
    BarRatingModule,
    BarRatingEffect,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent implements OnInit {
  latestProductList: Product | any = null;
  categoryList: Category | any = [];
  newArrivalList: Product | any = null;
  bannerList: Banner | any = null;
  blogList: Blog | any = null;
  isUserLoggedIn: boolean = false;
  static commonDialogParams = { disableClose: true };

  constructor(
    private _router: Router,
    private _productService: ProductService,
    private _categoryService: CategoryService,
    private _wishlistService: WishlistService,
    private _addToCartService: AddToCartService,
    private _homeService: HomeService,
    private _dialog: MatDialog,
    private _matSnackBar: MatSnackBar,
    private _utilService: UtilService,
    public _globalService: GlobalService,
  ) { }

  ngOnInit(): void {

    this._utilService.loginChangeObx.subscribe((user: any) => {
      this.isUserLoggedIn = !!user;
    });


    this.getLatestProduct();
    this.getBanner();
    this.getCategories();
    this.getNewArrivals(null);
    this.getBlog();
  }

  async getBanner() {
    this.bannerList = await this._homeService.getBannerList();
  }

  async getLatestProduct() {
    this.latestProductList = await this._productService.getLatestProduct();
    const wishlist = this.isUserLoggedIn ? await this._wishlistService.getWishlistAll(this.filterParams()) : [];
    const cartItem: any = this.isUserLoggedIn ? await this._addToCartService.getCartItem() : [];
    this.latestProductList.forEach((product: any) => {
      product['isWishlisted'] = false;
      product['isAddToCart'] = false;
      if (this.isUserLoggedIn) {
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
      }
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
  }

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
      const wishlist = this.isUserLoggedIn ? await this._wishlistService.getWishlistAll(this.filterParams()) : [];
      const cartItem: any = this.isUserLoggedIn ? await this._addToCartService.getCartItem() : [];
      this.newArrivalList.items.forEach((product: any) => {
        product['isWishlisted'] = false;
        product['isAddToCart'] = false;
        if (this.isUserLoggedIn) {
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
        }
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
    } catch (error: any) {
      this._utilService.showErrorSnack(this._matSnackBar, error.error.message);
    }
  };

  async getCategories() {
    this.categoryList = await this._categoryService.getCategoryList(this.filterParams());
  }

  async getBlog() {
    this.blogList = await this._homeService.getBlogList();
  }

  goTo(path: string) {
    this._router.navigate([path]);
  }
}
