import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FuseAlertType } from 'app/modules/auth/login/login.component';
import { MaterialModule } from 'app/modules/materials/material.module';
import { AuthService } from 'app/service/auth.service';
import { StorageService } from 'app/service/storage.service';
import { UserService } from 'app/service/user.service';
import { UtilService } from 'app/service/util.service';
import { ForgotPasswordPopupComponent } from '../forgot-password-popup/forgot-password-popup.component';
import { SecureImagePipe } from 'app/pipe/secure-image.pipe';

@Component({
  selector: 'app-login-modal',
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SecureImagePipe
  ],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.scss',
  standalone: true
})
export class LoginModalComponent implements OnInit {

  @ViewChild('signInNgForm') signInNgForm!: NgForm;

  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: '',
  };
  signInForm!: UntypedFormGroup;
  showAlert: boolean = false;
  companyLogo: string | any;

  constructor(
    private _dialogRef: MatDialogRef<LoginModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

    private _authService: AuthService,
    private _formBuilder: UntypedFormBuilder,
    private _matSnackBar: MatSnackBar,
    private _utilService: UtilService,
    private _userService: UserService,
    private _storageService: StorageService,
    private _router: Router,
    private dialog: MatDialog
  ) { }


  ngOnInit(): void {
    this.companyLogo = this._storageService.getLogo();

    // Create the form
    this.signInForm = this._formBuilder.group({
      gstNo: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  async signIn() {
    if (this.signInForm.valid) {
      try {
        this.signInForm.disable();
        const response = await this._authService.signIn(this.signInForm.value);
        this._utilService.loginUser(response);
        this._dialogRef.close(false);
      } catch (error: any) {
        this._utilService.showErrorSnack(this._matSnackBar, error.error.message);
        //   this.alert = {
        //       type: 'error',
        //       message: error?.error?.message ?? error?.message,
        //   };
        //   this.showAlert = true;
        this.signInForm.enable();
        this.signInForm.reset();
      }
    } else {
      this.signInForm.markAllAsTouched();
    }
  }
  forgotPassword() {
    this.dialog.open(ForgotPasswordPopupComponent, {
      autoFocus: false
    })
  }

  goTo(path: string) {
    this._router.navigate([path]);
  }

  closeDialog() {
    this._dialogRef.close(false);
  }
}
