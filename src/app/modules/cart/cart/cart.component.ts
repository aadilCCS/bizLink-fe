import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Product } from 'app/models/product';
import { BreadCrumbComponent } from 'app/modules/shared/bread-crumb/bread-crumb.component';
import { SecureImagePipe } from 'app/pipe/secure-image.pipe';
import { AddToCartService } from 'app/service/add-to-cart.service';
import { GlobalService } from 'app/service/global.service';
import { ProductService } from 'app/service/product.service';
import { UtilService } from 'app/service/util.service';
import { WishlistService } from 'app/service/wishlist.service';
import { BarRatingModule, BarRatingEffect } from 'ngx-bar-rating';

@Component({
  selector: 'app-cart',
  imports: [
    CommonModule,
    BreadCrumbComponent,
    SecureImagePipe,
    BarRatingModule,
    BarRatingEffect,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CartComponent {
  cart: any[] = [];
  cartItemList: Product | any = null;
  newArrivalList: Product | any = null;

  constructor(
    private _router: Router,
    private _cartService: AddToCartService,
    private _productService: ProductService,
    private _utilService: UtilService,
    private _matSnackBar: MatSnackBar,
    public _globalService: GlobalService,
    private _wishlistService: WishlistService,
    private _addToCartService: AddToCartService,
  ) { }

  ngOnInit(): void {
    this.getCartItem();
    this.getNewArrivals(null);
  }

  async getCartItem() {
    try {
      this.cartItemList = await this._cartService.getCartItem();
      this.cartItemList.forEach((item: any) => {
        item.model.forEach((model: any) => {
          this.recalculateSubtotals(model);
        });
      });
    } catch (error: any) {
      this._utilService.showErrorSnack(this._matSnackBar, error.error.message);
    }
  }

  getFirstMoqMin(model: any[]): number | null {
    if (model && model.length > 0 && model[0].moqs && model[0].moqs.length > 0) {
      return model[0].moqs[0].min;
    }
    return null;
  }

  // Get price for given quantity based on MOQ tiers
  getPriceForQuantity(model: any, quantity: number): number {
    if (!model?.moqs || model.moqs.length === 0) {
      return 0;
    }
    // Sort moqs by min ascending to be safe
    const sortedMoqs = model.moqs.sort((a: any, b: any) => a.min - b.min);
    for (let i = 0; i < sortedMoqs.length; i++) {
      const moq = sortedMoqs[i];
      if (quantity <= moq.max) {
        return moq.price;
      }
    }
    // If quantity exceeds all max, return price of last moq
    return sortedMoqs[sortedMoqs.length - 1].price;
  }

  recalculateSubtotals(model: any) {
    if (model) {
      const price = this.getPriceForQuantity(model, model.quantity);
      model.subTotal = price * model.quantity;
      model.gstTotal = model.subTotal * 0.18; // 18% GST
      model.grandTotal = model.subTotal + model.gstTotal;
    }
  }

  // Increment quantity for a model
  incrementQuantity(model: any) {
    model.quantity += 1;
    this.recalculateSubtotals(model);
  }

  // Decrement quantity for a model
  decrementQuantity(model: any) {
    if (model.quantity > 0) {
      model.quantity -= 1;
      this.recalculateSubtotals(model);
    }
  }

  // Handle manual quantity input change
  onQuantityChange(model: any, event: any) {
    let value = Number(event.target.value);
    if (isNaN(value) || value < 0) {
      value = 0;
    }
    model.quantity = value;
    this.recalculateSubtotals(model);
  }

  getSubTotal() {
    if (!this.cartItemList) return 0;
    let total = 0;
    this.cartItemList.forEach((item: any) => {
      item.model.forEach((model: any) => {
        total += model.subTotal || 0;
      });
    });
    return total;
  }

  getGst() {
    if (!this.cartItemList) return 0;
    let totalGst = 0;
    this.cartItemList.forEach((item: any) => {
      item.model.forEach((model: any) => {
        totalGst += model.gstTotal || 0;
      });
    });
    return totalGst;
  }

  getGrandTotal() {
    if (!this.cartItemList) return 0;
    let grandTotal = 0;
    this.cartItemList.forEach((item: any) => {
      item.model.forEach((model: any) => {
        grandTotal += model.grandTotal || 0;
      });
    });
    return grandTotal;
  }

  async updateCartItem(cartId: string, model: any) {
    const payload = {
      grandTotal: this.getGrandTotal().toFixed(2),
      gstTotal: this.getGst().toFixed(2),
      subTotal: this.getSubTotal().toFixed(2),
      model: [{
        modelId: model._id,
        quantity: model.quantity,
      }]
    }

    try {
      const result = await this._cartService.updateCartItem(cartId, payload);
      this._utilService.showSuccessSnack(this._matSnackBar, result.message);
    } catch (error: any) {
      this._utilService.showErrorSnack(this._matSnackBar, error.error.message);
    }
  }

  async removeCartItem(cartId: string) {
    try {
      const result = await this._cartService.removeCartItem(cartId);
      this._utilService.headerCount();
      this.getCartItem();
      this._utilService.showSuccessSnack(this._matSnackBar, result.message);
    } catch (error: any) {
      this._utilService.showErrorSnack(this._matSnackBar, error.error.message);
    }
  }

  filterParams(categoryId?: string | null): HttpParams {
    let params = new HttpParams();
    if (categoryId) {
      params = params.append('subCategory', categoryId);
    }
    // params = params.append('page', this.pagination.pageIndex + 1);
    params = params.append('limit', 6);

    return params;
  }

  async getNewArrivals(value: string | null) {
    try {
      this.newArrivalList = await this._productService.getProductsFiltered(this.filterParams(value));
      const wishlist = await this._wishlistService.getWishlistAll(this.filterParams());
      const cartItem: any = await this._addToCartService.getCartItem();
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
    } catch (error: any) {
      this._utilService.showErrorSnack(this._matSnackBar, error.error.message);
    }
  };

  goTo(path: string) {
    this._router.navigate([path]);
  }

  getNext7thDayDate(): string {
    const today = new Date();
    const next7thDay = new Date(today);
    next7thDay.setDate(today.getDate() + 7);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return next7thDay.toLocaleDateString('en-US', options);
  }

}
