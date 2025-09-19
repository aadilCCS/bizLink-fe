import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiUrls } from 'app/config';
import { AddToCart } from 'app/models/add-to-cart';
import { lastValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AddToCartService {
  constructor(
    private http: HttpClient,
  ) { }

  getCartItem(): Promise<AddToCart> {
    return lastValueFrom(this.http.get<AddToCart>(`${ApiUrls.CART}`));
  }

  addToCart(payload: AddToCart): Promise<AddToCart> {
    return lastValueFrom(this.http.post<AddToCart>(ApiUrls.CART, payload));
  }

  removeCartItem(cartId: string): Promise<any> {
    return lastValueFrom(this.http.delete<any>(`${ApiUrls.CART}/${cartId}`));
  }

  updateCartItem(cartId: string, payload: any): Promise<any> {
    return lastValueFrom(this.http.patch<any>(`${ApiUrls.CART}/${cartId}`, payload));
  }

  orderPlace(payload:any): Promise<any> {
    return lastValueFrom(this.http.post<any>(`${ApiUrls.ORDER_PLACE}`, payload));
  }
}
