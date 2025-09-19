import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Product } from '../models/product';
import { ApiUrls } from '../config';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(
    private http: HttpClient
  ) { }

  getProductsList(params: HttpParams): Promise<Product> {
    return lastValueFrom(this.http.get<Product>(ApiUrls.PRODUCT, { params }));
  }

  getProductsFiltered(params: HttpParams): Promise<Product> {
    return lastValueFrom(this.http.get<Product>(ApiUrls.PRODUCT_FILTERED, { params }));
  }

  getProductsFilteredByImage(file: any): Promise<any> {
    const formData = new FormData();
    formData.append('image', file);
    return lastValueFrom(this.http.post(ApiUrls.PRODUCT_FILTERED, formData, { headers: { 'fileUpload': 'true' } }));
  }

  getProductById(productId: string): Promise<Product> {
    return lastValueFrom(this.http.get<Product>(`${ApiUrls.FRONT_PRODUCT}/${productId}`));
  }

  getLatestProduct(): Promise<Product> {
    return lastValueFrom(this.http.get<Product>(ApiUrls.LATEST_PRODUCT));
  }

  getModelById(params: HttpParams): Promise<Product> {
    return lastValueFrom(this.http.get<Product>(ApiUrls.PRODUCT_MODEL, { params }));
  }
}
