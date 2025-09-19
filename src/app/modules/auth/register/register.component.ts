import { HttpParams } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { cloneDeep } from "lodash";
import { Router } from "@angular/router";
import { MaterialModule } from "../../materials/material.module";
import { SearchDropdownComponent } from "../../shared/search-dropdown/search-dropdown.component";
import { UtilService } from "../../../service/util.service";
import { UserService } from "../../../service/user.service";
import { DROPDOWN_TYPE } from "../../../enums/form-enum";
import { State } from "../../../models/state";
import { City } from "../../../models/city";
import { Country } from "../../../models/country";
import { GeneralService } from "../../../service/general.service";
import { MediaService } from "../../../service/media.service";
import { AccessControlCategory, User } from "../../../models/user";
import { RoleAccessControl } from "../../../models/roleAccessControl";
import { CommonModule } from "@angular/common";
import { SecureImagePipe } from "../../../pipe/secure-image.pipe";
import { MatDialog } from "@angular/material/dialog";
import { StorageService } from "app/service/storage.service";
import { Package } from "app/models/package";

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    MaterialModule,
    SearchDropdownComponent,
    FormsModule,
    ReactiveFormsModule,
    SecureImagePipe,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  DROPDOWN_TYPE = DROPDOWN_TYPE;

  userForm!: FormGroup;
  currentUserId: string | null = null;
  currentUser: User | any = {
    businessInfo: {}
  };
  loginUser: User | null = null;
  stateList: State | any = null;
  cityList: City | any = null;
  countryList: Country | any = null;
  roleAccessControl: RoleAccessControl | any = null;
  packageList: Package | any = null;
  accessControls: AccessControlCategory[] = [];
  isPermissionDisable: boolean = false;
  static commonDialogParams = { disableClose: true, maxHeight: '100vh', };
  companyLogo: string | any;
  submitEnable: boolean = true;
  isSeller: boolean = false;
  urlParams: any = null;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _dialog: MatDialog,
    private _utilService: UtilService,
    private _generalService: GeneralService,
    private _matSnackBar: MatSnackBar,
    public _userService: UserService,
    public _mediaService: MediaService,
    private _storageService: StorageService,
  ) { }

  ngOnInit(): void {
    this.companyLogo = this._storageService.getLogo();

    this.initializeForm();
    this.getCountry();
    this.getRole();

  }

  initializeForm() {
    this.userForm = this._fb.group({
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      gstNo: new FormControl(null, [Validators.required]),
      phoneNo: new FormControl(null, [
        Validators.required,
        Validators.minLength(10),
      ]),
      businessInfo: new FormGroup({
        name: new FormControl(null),
        tradeName: new FormControl(null),
        tinNo: new FormControl(null),
        cinNo: new FormControl(null),
        logo: new FormControl(null),
      }),
      address: new FormGroup({
        address1: new FormControl(null),
        address2: new FormControl(null),
        pinCode: new FormControl(null),
        country: new FormControl(null),
        state: new FormControl(null),
        city: new FormControl(null),
      }),
      password: new FormControl(null, [Validators.required]),
      package: new FormControl(null),
      confirmPassword: new FormControl(null, [Validators.required]),
      role: new FormControl(null, [Validators.required]),
      isActive: new FormControl(true),
    });
  }

  get f() {
    return this.userForm.controls;
  }

  async onSubmit() {

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    if (this.userForm.value.password != this.userForm.value.confirmPassword) {
      this._utilService.showErrorSnack(
        this._matSnackBar,
        "Confirm password does not match!"
      );
      return;
    }

    var payload = cloneDeep(this.userForm.value);
    delete payload.confirmPassword;
    if (this.currentUserId && !payload.password) {
      delete payload.password;
    }

    try {
      this.submitEnable = false;
      await this._userService.createUser(payload);
      this._router.navigate(["/sign-in"]);
      this._utilService.showSuccessSnack(this._matSnackBar, "User created successfully!");
    } catch (error: any) {
      this._utilService.showErrorSnack(this._matSnackBar, error.error.message);
    } finally {
      this.submitEnable = true;
    }
  }

  async getCountry() {
    this.countryList = await this._generalService.getCountryList();
  }

  async getRole() {
    const response: any = await this._generalService.getRoleList();
    this.roleAccessControl = response.filter((res: any) => res.role == 'buyer' || res.role == 'seller');
  }

  async getPackage() {
    this.packageList = await this._generalService.getPackageList();
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

  goToAdmin() { }

  async onLogoChange(event: any): Promise<any> {
    const [selectedFile] = event.target?.files;
    const allowedExtensions = new Array('png', 'jpeg', 'jpg');
    const extension: string = selectedFile.name.split('.')[1];
    if (allowedExtensions.includes(extension.toLowerCase())) {
      try {
        const file = await this._mediaService.upload(selectedFile, true);
        // this.userForm.get("businessInfo").patchValue({ logo: file.id });
        this.userForm.get("businessInfo")?.patchValue({ logo: file.id });
        this.currentUser.businessInfo.logo = file.id;
      } catch (error: any) {
        this._utilService.showErrorSnack(this._matSnackBar, error.error.message)
      }
    } else {
      this._utilService.showErrorSnack(this._matSnackBar, 'Allowed only file having extension png, jpeg and jpg.');
    }
  }

  async removeLogo(id: string) {
    try {
      await this._mediaService.deleteFeFile(id);
      this.userForm.get("businessInfo")?.patchValue({ logo: null });
      this.currentUser.businessInfo.logo = null;
    } catch (error: any) {
      this._utilService.showErrorSnack(this._matSnackBar, error.message);
    }
  }

  async onRoleChange(event: string | object) {
    const result = this.roleAccessControl.find((role: any) => role.id === event);
    if (result.role === 'seller') {
      this.getPackage()
      this.isSeller = true
    } else {
      this.isSeller = false;
    }
  }

  goTo(path: string) {
    this._router.navigate([path]);
  }
}