import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiUrls } from 'app/config';
import { Category } from 'app/models/category';
import { PaginationResponse } from 'app/models/pagination-response';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private http: HttpClient,
  ) { }

  getCategoryListAll(): Promise<Category[]> {
    return lastValueFrom(this.http.get<Category[]>(ApiUrls.CATEGORY));
  }

  getCategoryList(params: HttpParams): Promise<Category> {
    return lastValueFrom(this.http.get<Category>(ApiUrls.GET_ALL_CATEGORIES, { params }));
  }
}
