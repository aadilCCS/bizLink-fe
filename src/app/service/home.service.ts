import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiUrls } from 'app/config';
import { Banner } from 'app/models/banner';
import { Blog } from 'app/models/blog';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(
    private http: HttpClient,
  ) { }

  getBannerList(): Promise<Banner> {
    return lastValueFrom(this.http.get<Banner>(ApiUrls.BANNER));
  }

  getBlogList(): Promise<Blog> {
    return lastValueFrom(this.http.get<Blog>(ApiUrls.BLOG));
  }

  searchByImg(file: any): Promise<any> {
    const formData = new FormData();
    formData.append('image', file);
    return lastValueFrom(this.http.post(ApiUrls.SEARCH_BY_IMAGE, formData, { headers: { 'fileUpload': 'true' } }));
  }
}
