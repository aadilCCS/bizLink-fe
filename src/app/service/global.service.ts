import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WishlistService } from './wishlist.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UtilService } from './util.service';
import { Product } from 'app/models/product';
import { ProductDetailPopupComponent } from 'app/modules/shared/product-detail-popup/product-detail-popup.component';
import { SidenavService } from 'app/modules/shared/sidenav/sidenav.service';
import { LoginModalComponent } from 'app/modules/shared/login-modal/login-modal.component';
 import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  isUserLoggedIn: boolean = false;

  constructor(
    private http: HttpClient,
    private _dialog: MatDialog,
    private _wishlistService: WishlistService,
    private _matSnackBar: MatSnackBar,
    private _utilService: UtilService,
    private sidenavService: SidenavService,
    private location: Location
  ) {
    this._utilService.loginChangeObx.subscribe((user) => {
      this.isUserLoggedIn = !!user;
    })
  }


  openQuickView(product: Product) {
    this._dialog.open(ProductDetailPopupComponent, {
      ...{
        data: product,
        panelClass: 'custom-dialog-container',
        maxWidth: '900px',
      },
    });
  }

  async addToWishlist(productId: string) {

    if (this.isUserLoggedIn) {
      const payload = {
        productId: productId,
        isWishlistSelect: true
      }
      try {
        const result: any = await this._wishlistService.createWishlist(payload);
        this._utilService.showSuccessSnack(this._matSnackBar, result.message);
        this._utilService.headerCount();
      } catch (error: any) {
        this._utilService.showErrorSnack(this._matSnackBar, error.error.message);
      }
    } else {
      const dialogRef = this._dialog.open(LoginModalComponent, {
        ...{
          maxWidth: '700px'
        }
      })
      dialogRef.afterClosed().subscribe(async (data) => {
        if (!data) {
           this.location.back();
        }
      })
    }

  }

  addToCart(productDetails: any) {
    this.sidenavService.open(productDetails);
  }

}
