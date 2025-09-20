import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiUrls } from 'app/config';
import { Order } from 'app/models/order';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private http: HttpClient
  ) { }

  getOrderList(id: string): Promise<Order[]> {
    return lastValueFrom(this.http.get<Order[]>(`${ApiUrls.USER_ORDER}/${id}`));
  }

  updateOrder(orderId: string, payload: any): Promise<Order> {
    return lastValueFrom(this.http.patch<Order>(`${ApiUrls.ORDER}/${orderId}`, payload));
  }

  deleteOrder(orderId: string): Promise<any> {
    return lastValueFrom(this.http.delete<any>(`${ApiUrls.ORDER}/${orderId}`));
  }

  returnOrder(orderId: string, payload:any): Promise<any> {
    return lastValueFrom(this.http.post<any>(`${ApiUrls.ORDER}/${orderId}/return` , payload));
  }

  cancelOrder(orderId: string, payload:any): Promise<any> {
    return lastValueFrom(this.http.post<any>(`${ApiUrls.ORDER}/${orderId}/cancel` , payload));
  }

  exportPdf(id: string): Promise<HttpResponse<Blob>> {
    return lastValueFrom(
      this.http.get(`${ApiUrls.ORDER_EXPORT_PDF}/${id}`, {
        responseType: 'blob',
        observe: 'response',
      })
    );
  }
}
