import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiUrls } from 'app/config';
import { PaginationResponse } from 'app/models/pagination-response';
import { ReturnOrder } from 'app/models/return-order';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReturnOrderService {
  constructor(
    private http: HttpClient,
  ) { }

  getReturnOrderList(params: HttpParams): Promise<PaginationResponse<ReturnOrder>> {
    return lastValueFrom(this.http.get<PaginationResponse<ReturnOrder>>(ApiUrls.ORDER_RETURN, { params }));
  }

  getReturnOrderListAll(params: HttpParams): Promise<ReturnOrder[]> {
    return lastValueFrom(this.http.get<ReturnOrder[]>(ApiUrls.ORDER_RETURN, { params }));
  }

  createReturnOrder(orderId: string, payload: ReturnOrder): Promise<ReturnOrder> {
    return lastValueFrom(this.http.post<ReturnOrder>(`${ApiUrls.ORDER_RETURN}/${orderId}`, payload));
  }

  updateReturnOrder(ReturnOrderId: string, payload: any): Promise<ReturnOrder> {
    return lastValueFrom(this.http.patch<ReturnOrder>(`${ApiUrls.ORDER_RETURN}/${ReturnOrderId}`, payload));
  }

  getReturnOrderById(ReturnOrderId: string): Promise<ReturnOrder> {
    return lastValueFrom(this.http.get<ReturnOrder>(`${ApiUrls.ORDER_RETURN}/${ReturnOrderId}`));
  }

  deleteReturnOrder(ReturnOrderId: string): Promise<any> {
    return lastValueFrom(this.http.delete<ReturnOrder>(`${ApiUrls.ORDER_RETURN}/${ReturnOrderId}`));
  }
}
