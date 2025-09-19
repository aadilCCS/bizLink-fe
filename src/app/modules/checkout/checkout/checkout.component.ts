import { CommonModule } from '@angular/common';
import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, ValueChangeEvent } from '@angular/forms';
import { BreadCrumbComponent } from 'app/modules/shared/bread-crumb/bread-crumb.component';
import { AddToCartService } from 'app/service/add-to-cart.service';
import { UtilService } from 'app/service/util.service';
import { Router } from '@angular/router';
import { Product } from 'app/models/product';
import { MaterialModule } from 'app/modules/materials/material.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SecureImagePipe } from 'app/pipe/secure-image.pipe';
import { DROPDOWN_TYPE } from 'app/enums/form-enum';
import { Country } from 'app/models/country';
import { State } from 'app/models/state';
import { City } from 'app/models/city';
import { GeneralService } from 'app/service/general.service';
import { AddressService } from 'app/service/address.service';
import { cloneDeep } from 'lodash';
import { Address } from 'app/models/address';
import { MatDialog } from '@angular/material/dialog';
import { AddressComponent } from 'app/modules/shared/address/address.component';

@Component({
  selector: 'app-checkout',
  imports: [
    CommonModule,
    FormsModule,
    BreadCrumbComponent,
    ReactiveFormsModule,
    SecureImagePipe,
    MaterialModule,
  ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CheckoutComponent implements OnInit {
  DROPDOWN_TYPE = DROPDOWN_TYPE;
  cartItemList: Product | any = null;
  shippingForm: FormGroup;
  paymentForm: FormGroup;
  countryList: Country | any = null;
  stateList: State | any = null;
  cityList: City | any = null;
  addressList: Address | any = null;
  loggedInUserDetails: Address | any = null;
  selectedAdd: string | any = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private cartService: AddToCartService,
    private _generalService: GeneralService,
    private _addressService: AddressService,
    private _utilService: UtilService,
    private snackBar: MatSnackBar,
    private _dialog: MatDialog,
    private router: Router
  ) {
    this.shippingForm = this.fb.group({
      fullName: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pinCode: ['', [Validators.required, Validators.pattern('^[0-9]{5,6}$')]],
      country: ['', Validators.required],
      phoneNo: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]]
    });

    this.paymentForm = this.fb.group({
      cardName: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expiryMonth: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])$')]],
      expiryYear: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]]
    });
  }

  ngOnInit(): void {
    this.loadCartItems();
    this.getCountry();
    this.getAddress();

    this._utilService.loginChangeObx.subscribe((user) => {
      this.loggedInUserDetails = user;
      this.selectedAdd = user?.address || '';
    })
  }

  async loadCartItems() {
    try {
      this.cartItemList = await this.cartService.getCartItem();
    } catch (error: any) {
      this._utilService.showErrorSnack(this.snackBar, error.error.message || 'Failed to load cart items');
    }
  }

  async getAddress() {
    try {
      this.addressList = await this._addressService.getAddressListAll();
      this.addressList = this.addressList.map((address: any) => {
        return {
          ...address,
          fullAddress: `${address.address1}, ${address.address2 || ''}, ${address.city?.name}, ${address.state?.name}, ${address.country?.name} - ${address.pinCode}`,
          selected: address._id === this.selectedAdd
        };
      });
    } catch (error: any) {
      this._utilService.showErrorSnack(this.snackBar, error.message || 'Failed to load address list');
    }
  }

  selectedAddress(event: any) {
    this.selectedAdd = event;
  }

  openAddPopup(addId?: string) {
    const dialogRef = this._dialog.open(AddressComponent, {
      data: { addressId: addId }
    });
    dialogRef.afterClosed().subscribe(async (data) => {
      if (data) {
        try {
          this.getAddress();
        } catch (error: any) {
          this._utilService.showErrorSnack(this.snackBar, error.error.message);
        }
      }
    });
  }

  getFirstMoqMin(model: any) {
    if (model.moqs && model.moqs.length > 0) {
      return `${model.moqs[0].min} - ${model.moqs[0].max}`;
    }
    return null;
  }

  // Get price for given quantity based on MOQ tiers
  getPriceForQuantity(model: any, quantity: number): number {
    if (!model?.moqs || model.moqs.length === 0) {
      return 0;
    }
    // Sort moqs by min ascending to be safe
    const sortedMoqs = model.moqs.sort((a: any, b: any) => a.min - b.min);
    for (let i = 0; i < sortedMoqs.length; i++) {
      const moq = sortedMoqs[i];
      if (quantity <= moq.max) {
        return moq.price;
      }
    }
    // If quantity exceeds all max, return price of last moq
    return sortedMoqs[sortedMoqs.length - 1].price;
  }

  recalculateSubtotals(model: any) {
    if (model) {
      const price = this.getPriceForQuantity(model, model.quantity);
      model.subTotal = price * model.quantity;
      model.gstTotal = model.subTotal * 0.18; // 18% GST
      model.grandTotal = model.subTotal + model.gstTotal;
    }
  }

  getSubTotal() {
    if (!this.cartItemList) return 0;
    let total = 0;
    this.cartItemList.forEach((item: any) => {
      item.model.forEach((model: any) => {
        this.recalculateSubtotals(model);
        total += model.subTotal || 0;
      });
    });
    return total;
  }

  getGst() {
    if (!this.cartItemList) return 0;
    let totalGst = 0;
    this.cartItemList.forEach((item: any) => {
      item.model.forEach((model: any) => {
        this.recalculateSubtotals(model);
        totalGst += model.gstTotal || 0;
      });
    });
    return totalGst;
  }

  getGrandTotal() {
    if (!this.cartItemList) return 0;
    let grandTotal = 0;
    this.cartItemList.forEach((item: any) => {
      item.model.forEach((model: any) => {
        this.recalculateSubtotals(model);
        grandTotal += model.grandTotal || 0;
      });
    });
    return grandTotal;
  }

  // async placeOrder() {
  //   if (this.shippingForm.invalid) {
  //     this._utilService.showErrorSnack(this.snackBar, 'Please fill all required shipping details correctly.');
  //     return;
  //   }

  //   var payload = cloneDeep(this.shippingForm.value);
  //   try {
  //     await this._addressService.createAddress(payload);
  //     this.router.navigate(['/']);
  //     this._utilService.showSuccessSnack(this.snackBar, 'Order placed successfully!');
  //   } catch (error: any) {
  //     this._utilService.showErrorSnack(this.snackBar, error.error.message);
  //   }
  // }

  async getCountry() {
    this.countryList = await this._generalService.getCountryList();
  }

  selectedCountry(selectedCountryId: any) {
    this.getState(selectedCountryId);
  }

  async getState(selectedCountryId: string) {
    this.stateList = await this._generalService.getStateByCountry(selectedCountryId);
  }

  selectedState(selectedCityId: any) {
    this.getCity(selectedCityId);
  }

  async getCity(selectedCityId: string) {
    this.cityList = await this._generalService.getCityByState(selectedCityId);
  }

  async orderPlace() {
    try {
      this.isLoading = true;
      const payload = {
        address: this.selectedAdd,
      };
      const result = await this.cartService.orderPlace(payload);
      this._utilService.showSuccessSnack(this.snackBar, result.message);
      this.isLoading = false;
      this._utilService.headerCount();
      this.router.navigate(['/shop']);
    } catch (error: any) {
      this.isLoading = false;
      this._utilService.showErrorSnack(this.snackBar, error.error.message);
    }
  }
}
