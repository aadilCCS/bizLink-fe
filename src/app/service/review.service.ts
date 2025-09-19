import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiUrls } from 'app/config';
import { Review } from 'app/models/review';
import { lastValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(
    private http: HttpClient,
  ) { }

  addReview(productId: string, payload: Review): Promise<Review[]> {
    return lastValueFrom(this.http.post<Review[]>(`${ApiUrls.REVIEW}/${productId}`, payload));
  }

  getReview(productId: string): Promise<Review[]> {
    return lastValueFrom(this.http.get<Review[]>(`${ApiUrls.REVIEW}/${productId}`));
  }

}
