import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'app/models/product';
import { User } from 'app/models/user';
import { SecureImagePipe } from 'app/pipe/secure-image.pipe';
import { GeneralService } from 'app/service/general.service';
import { UtilService } from 'app/service/util.service';

@Component({
  selector: 'app-seller-list',
  imports: [CommonModule, SecureImagePipe],
  templateUrl: './seller-list.component.html',
  styleUrl: './seller-list.component.scss'
})
export class SellerListComponent implements OnInit {
  currentItemId: string | null = null;
  productList: Product[] = [];
  userDetails: User | any = {}


  constructor(
    private _activatedRoute: ActivatedRoute,
    private _generalService: GeneralService,
    private _utilService: UtilService,
    private _matSnackBar: MatSnackBar,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe((params) => {
      this.currentItemId = params.get("id");
      this.loadPreData();
    });
  }


  async loadPreData() {
    try {
      if (this.currentItemId) {
        const result: any = await this._generalService.getSellersList(this.currentItemId);
        this.productList = result?.product;
        this.userDetails = result?.user;
      }
    } catch (error: any) {
      this._utilService.showErrorSnack(this._matSnackBar, error.error.message);
    }
  }

  getFirstMoqMin(model: any[]): number | null {
    if (model && model.length > 0 && model[0].moqs && model[0].moqs.length > 0) {
      return model[0].moqs[0].min;
    }
    return null;
  }

  goTo(path: string) {
    this._router.navigate([path]);
  }

  getNext7thDayDate(): string {
    const today = new Date();
    const next7thDay = new Date(today);
    next7thDay.setDate(today.getDate() + 7);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return next7thDay.toLocaleDateString('en-US', options);
  }
}
