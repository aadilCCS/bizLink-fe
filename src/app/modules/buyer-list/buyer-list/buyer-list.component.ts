import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PaginationResponse } from 'app/models/pagination-response';
import { User } from 'app/models/user';
import { BreadCrumbComponent } from 'app/modules/shared/bread-crumb/bread-crumb.component';
import { SecureImagePipe } from 'app/pipe/secure-image.pipe';
import { AuthService } from 'app/service/auth.service';
import { GeneralService } from 'app/service/general.service';
import { UtilService } from 'app/service/util.service';

@Component({
  selector: 'app-buyer-list',
  imports: [
    CommonModule,
    BreadCrumbComponent,
    SecureImagePipe
  ],
  templateUrl: './buyer-list.component.html',
  styleUrl: './buyer-list.component.scss'
})
export class BuyerListComponent implements OnInit {
  locationAllowed: boolean = true;
  currentLatitude: number = 0;
  currentLongitude: number = 0;
  getBuyerList: User[] = [];
  isShowNumber: boolean = false;

  // Define the properties and methods for the component here
  constructor(
    private _utilService: UtilService,
    private _matSnakBar: MatSnackBar,
    private _generalService: GeneralService,
    private _authService: AuthService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    // Initialization logic goes here
    this._utilService.loginChangeObx.subscribe((user) => {
      this.checkLocation(user);
    });
  }


  checkLocation(user: User | null) {
    navigator.geolocation.getCurrentPosition(async (resp) => {
      if (resp) {
        this.locationAllowed = true;
        this.currentLatitude = resp.coords.latitude;
        this.currentLongitude = resp.coords.longitude;

        try {
          this.getBuyersList();
        } catch (error: any) {
          this._utilService.showErrorSnack(this._matSnakBar, error.error.message);
        }
      }
    },
      err => {
        this.locationAllowed = false;
        this._utilService.showErrorSnack(this._matSnakBar, err.message);
      }
    );
  }

  filterParams(): HttpParams {
    let params = new HttpParams();
    params = params.append('latitude', this.currentLatitude);
    params = params.append('longitude', this.currentLongitude);
    return params;
  }

  async getBuyersList() {
    const response = await this._generalService.getBuyersList(this.filterParams());
    this.getBuyerList = response.items;
  }

  logout() {
    this._authService.signOut();
    this._router.navigate(['/'])
  }

  prevImage(buyer: any): void {
    if (buyer.currentImageIndex > 0) {
      buyer.currentImageIndex--;
    } else {
      buyer.currentImageIndex = buyer.images.length - 1;
    }
  }

  nextImage(buyer: any): void {
    if (buyer.currentImageIndex < buyer.images.length - 1) {
      buyer.currentImageIndex++;
    } else {
      buyer.currentImageIndex = 0;
    }
  }

  showNumber(): void {
    this.isShowNumber = !this.isShowNumber;
  }

  openWhatsApp(buyer: any): void {
    const phoneNumber = `+91${buyer.phoneNo}`;
    const url = `https://wa.me/${phoneNumber.replace(/\D/g, '')}`;
    window.open(url, '_blank');
  }
}
