import { Injectable } from '@angular/core';
import { Product } from 'app/models/product';
import { Subject } from 'rxjs';

interface SidenavToggle {
  action: 'open' | 'close';
  product?: Product | null;
  selectedVariants?: { [modelId: string]: { [variantNameId: string]: string[] } };
}


@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  public sidenavToggleSubject = new Subject<SidenavToggle>();
  public product: Product | null = null;

  sidenavToggle$ = this.sidenavToggleSubject.asObservable();

  open(data: { product: Product; selectedVariants?: { [modelId: string]: { [variantNameId: string]: string[] } } }) {
    this.product = data.product;
    this.sidenavToggleSubject.next({ action: 'open', product: data.product, selectedVariants: data.selectedVariants });
  }

  close() {
    this.sidenavToggleSubject.next({ action: 'close' });
  }
}
