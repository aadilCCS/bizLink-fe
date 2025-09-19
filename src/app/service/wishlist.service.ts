import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiUrls } from 'app/config';
import { Wishlist } from 'app/models/wishlist';
import { PaginationResponse } from 'app/models/pagination-response';
import { lastValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(
    private http: HttpClient,
  ) { }

  getWishlist(params: HttpParams): Promise<PaginationResponse<Wishlist>> {
    return lastValueFrom(this.http.get<PaginationResponse<Wishlist>>(ApiUrls.WISHLIST, { params }));
  }

  getWishlistAll(params: HttpParams): Promise<Wishlist[]> {
    console.log("wishlist from product detail");
    
    return lastValueFrom(this.http.get<Wishlist[]>(ApiUrls.WISHLIST, { params }));
  }

  createWishlist(payload: Wishlist): Promise<Wishlist> {
    return lastValueFrom(this.http.post<Wishlist>(ApiUrls.WISHLIST, payload));
  }

  updateWishlist(wishlistId: string, payload: any): Promise<Wishlist> {
    return lastValueFrom(this.http.patch<Wishlist>(`${ApiUrls.WISHLIST}/${wishlistId}`, payload));
  }

  getWishlistById(wishlistId: string): Promise<Wishlist> {
    return lastValueFrom(this.http.get<Wishlist>(`${ApiUrls.WISHLIST}/${wishlistId}`));
  }

  deleteWishlist(wishlistId: string): Promise<any> {
    return lastValueFrom(this.http.delete<any>(`${ApiUrls.WISHLIST}/${wishlistId}`));
  }
}
