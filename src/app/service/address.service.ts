import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiUrls } from 'app/config';
import { Address } from 'app/models/address';
import { PaginationResponse } from 'app/models/pagination-response';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(
    private http: HttpClient,
  ) { }

  getAddressList(params: HttpParams): Promise<PaginationResponse<Address>> {
    return lastValueFrom(this.http.get<PaginationResponse<Address>>(ApiUrls.ADDRESS, { params }));
  }

  getAddressListAll(): Promise<Address> {
    return lastValueFrom(this.http.get<Address>(ApiUrls.ADDRESS));
  }

  createAddress(payload: Address): Promise<Address> {
    return lastValueFrom(this.http.post<Address>(ApiUrls.ADDRESS, payload));
  }

  updateAddress(addressId: string, payload: any): Promise<Address> {
    return lastValueFrom(this.http.patch<Address>(`${ApiUrls.ADDRESS}/${addressId}`, payload));
  }

  getAddressById(addressId: string): Promise<Address> {
    return lastValueFrom(this.http.get<Address>(`${ApiUrls.ADDRESS}/${addressId}`));
  }

  deleteAddress(addressId: string): Promise<any> {
    return lastValueFrom(this.http.delete<any>(`${ApiUrls.ADDRESS}/${addressId}`));
  }
}
