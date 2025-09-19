import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loaderSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public loaderState: Observable<boolean> = this.loaderSubject.asObservable();

  private requestCount = 0;

  show(): void {
    this.requestCount++;
    if (this.requestCount === 1) {
      this.loaderSubject.next(true);
    }
  }

  hide(): void {
    if (this.requestCount > 0) {
      this.requestCount--;
    }
    if (this.requestCount === 0) {
      this.loaderSubject.next(false);
    }
  }
}
