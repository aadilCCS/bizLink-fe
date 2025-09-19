import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { UtilService } from './util.service';
import { ApiUrls } from '../config';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  constructor(
    private http: HttpClient,
    private utilService: UtilService,
    @Inject(DOCUMENT) private document: Document
  ) { }

  getImageUrl(id: string): string | null {
    if (id != undefined && id.trim().length != 0) {
      return this.utilService.formatString(ApiUrls.MEDIA_DOWNLOAD, id.trim());
    } else {
      return null;
    }
  }

  upload(file: any, publicFile: boolean = false): Promise<any> {
    const formData = new FormData();
    formData.append('files', file);
    return lastValueFrom(this.http.post(ApiUrls.MEDIA_UPLOAD, formData, { headers: { 'fileUpload': 'true' } }));
  }

  deleteFile(fileId: string): Promise<any> {
    return lastValueFrom(this.http.delete<any>(`${ApiUrls.MEDIA}/${fileId}`));
  }

  deleteFeFile(fileId: string): Promise<any> {
    return lastValueFrom(this.http.delete<any>(`${ApiUrls.MEDIA_FE}/${fileId}`));
  }

}
