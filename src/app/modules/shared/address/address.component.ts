import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from 'app/modules/materials/material.module';
import { SearchDropdownComponent } from '../search-dropdown/search-dropdown.component';
import { DROPDOWN_TYPE } from 'app/enums/form-enum';
import { Country } from 'app/models/country';
import { State } from 'app/models/state';
import { City } from 'app/models/city';
import { GeneralService } from 'app/service/general.service';
import { AddressService } from 'app/service/address.service';
import { UtilService } from 'app/service/util.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cloneDeep } from 'lodash';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Address } from 'app/models/address';

@Component({
  selector: 'app-address',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SearchDropdownComponent,
  ],
  templateUrl: './address.component.html',
  styleUrl: './address.component.scss'
})
export class AddressComponent implements OnInit {
  DROPDOWN_TYPE = DROPDOWN_TYPE;
  shippingForm!: FormGroup;
  countryList: Country | any = null;
  stateList: State | any = null;
  cityList: City | any = null;
  currentAddId: string | null = null;
  currentAdd: Address | any = null;

  constructor(
    private _dialogRef: MatDialogRef<AddressComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

    private fb: FormBuilder,
    private _generalService: GeneralService,
    private _addressService: AddressService,
    private _utilService: UtilService,
    private _matSnackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.initializeForm();

    if (this.data && this.data.addressId) {
      this.currentAddId = this.data.addressId;
      this.loadPreData();

    }

    this.getCountry();
  }

  initializeForm() {
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
  }

  async loadPreData() {
    try {
      if (this.currentAddId) {
        this.currentAdd = await this._addressService.getAddressById(
          this.currentAddId
        );

        this.shippingForm.patchValue({
          fullName: this.currentAdd.fullName,
          address1: this.currentAdd.address1,
          address2: this.currentAdd.address2,
          city: this.currentAdd.city,
          state: this.currentAdd.state,
          pinCode: this.currentAdd.pinCode,
          country: this.currentAdd.country,
          phoneNo: this.currentAdd.phoneNo,
        });
      }

      if (this.currentAdd?.country != null || this.currentAdd?.state != null) {
        this.selectedCountry(this.currentAdd?.country);
        this.selectedState(this.currentAdd?.state);
      }
    } catch (error: any) {
      this._utilService.showErrorSnack(this._matSnackBar, error.error.message);
    }
  }

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

  async onSubmit() {
    if (this.shippingForm.invalid) {
      this._utilService.showErrorSnack(this._matSnackBar, 'Please fill all required address details correctly.');
      return;
    }

    var payload = cloneDeep(this.shippingForm.value);
    try {
      if (this.currentAddId) {
        await this._addressService.updateAddress(this.currentAddId, payload);
        this._utilService.showSuccessSnack(this._matSnackBar, 'Address updated successfully!');
      } else {
        await this._addressService.createAddress(payload);
        this._utilService.showSuccessSnack(this._matSnackBar, 'Address created successfully!');
      }
      this._dialogRef.close(true);
    } catch (error: any) {
      this._utilService.showErrorSnack(this._matSnackBar, error.error.message);
    }
  }

  closeDialog() {
    this._dialogRef.close(false);
  }
}
