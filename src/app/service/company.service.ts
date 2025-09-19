import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiUrls } from 'app/config';
import { Category } from 'app/models/category';
import { CompanySettings } from 'app/models/company';
import { PaginationResponse } from 'app/models/pagination-response';
import { lastValueFrom } from 'rxjs';
import { UtilService } from './util.service';


@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(
    private http: HttpClient,
    private _utilService: UtilService,
  ) { }

  getSettings(): Promise<CompanySettings> {
    return lastValueFrom(this.http.get<CompanySettings>(`${ApiUrls.COMPANY_SETTINGS}`));
  }

  updateSettings(payload: any): Promise<CompanySettings> {
    return lastValueFrom(this.http.patch<CompanySettings>(`${ApiUrls.COMPANY_SETTINGS}`, payload));
  }

  async saveCompanyDetailsInTheLocalStorage() {
    try {
      let data = await this.getSettings();
      this._utilService.setCompanyDetails(data);
    } catch (e) {
      console.error(e);
    }
  }
}
