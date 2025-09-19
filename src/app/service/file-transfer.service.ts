import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileTransferService {
  private fileSubject = new BehaviorSubject<File | null>(null);
  private fileUrlSubject = new BehaviorSubject<string | null>(null);

  constructor() { }

  setFile(file: File): void {
    this.fileSubject.next(file);
  }

  getFile(): Observable<File | null> {
    return this.fileSubject.asObservable();
  }

  setFileUrl(url: string): void {
    this.fileUrlSubject.next(url);
  }

  getFileUrl(): Observable<string | null> {
    return this.fileUrlSubject.asObservable();
  }

  clearFile(): void {
    this.fileSubject.next(null);
    this.fileUrlSubject.next(null);
  }
}
