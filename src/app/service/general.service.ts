import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginationResponse } from '../models/pagination-response';
import { Country } from '../models/country';
import { ApiUrls } from '../config';
import { lastValueFrom } from 'rxjs';
import { State } from '../models/state';
import { City } from '../models/city';
import { RoleAccessControl } from '../models/roleAccessControl';
import { User } from 'app/models/user';
import { Product } from 'app/models/product';
import { Package } from 'app/models/package';
interface HeaderCount {
  cartCount: number
}

interface SellerList {
  user: User,
  product: Product
}

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(
    private http: HttpClient,
  ) { }

  getCountryList(): Promise<PaginationResponse<Country>> {
    return lastValueFrom(this.http.get<PaginationResponse<Country>>(ApiUrls.COUNTRY));
  }

  getStateByCountry(stateId: {}): Promise<State> {
    return lastValueFrom(this.http.get<State>(`${ApiUrls.STATE}/by-country/${stateId}`));
  }

  getCityByState(districtId: {}): Promise<City> {
    return lastValueFrom(this.http.get<City>(`${ApiUrls.CITY}/by-state/${districtId}`));
  }

  getRoleList(): Promise<PaginationResponse<RoleAccessControl>> {
    return lastValueFrom(this.http.get<PaginationResponse<RoleAccessControl>>(ApiUrls.ROLE));
  }

  getPackageList(): Promise<PaginationResponse<Package>> {
    return lastValueFrom(this.http.get<PaginationResponse<Package>>(ApiUrls.PACKAGE));
  }

  getHeaderCount(): Promise<HeaderCount> {
    return lastValueFrom(this.http.get<HeaderCount>(ApiUrls.GET_HEADER_COUNT));
  }

  async headerCount() {
    return await this.getHeaderCount();
  }

  getBuyersList(params: HttpParams): Promise<PaginationResponse<User>> {
    return lastValueFrom(this.http.get<PaginationResponse<User>>(ApiUrls.GET_BUYERS, { params }));
  }

  getSellersList(sellerId: string): Promise<PaginationResponse<SellerList>> {
    return lastValueFrom(this.http.get<PaginationResponse<SellerList>>(`${ApiUrls.GET_SELLERS}/${sellerId}`));
  }

}
