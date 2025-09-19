import { HttpClient } from "@angular/common/http";
import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { UtilService } from "../service/util.service";
import { ApiUrls } from "../config";

@Pipe({
  name: 'secureImage'
})
export class SecureImagePipe implements PipeTransform {
  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private utilService: UtilService
  ) { }

  transform(id: any, error: string): Observable<SafeUrl> | null {
    if (id) {
      const url = this.utilService.formatString(
        ApiUrls.MEDIA_DOWNLOAD,
        id.trim()
      );
      return this.http.get(url, { responseType: "blob" }).pipe(
        map((val) =>
          this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(val))
        ),
        catchError((_e) => {
          return of(error);
        })
      );
    } else {
      return of(error);
    }
  }
}
