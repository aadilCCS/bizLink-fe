import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ForgotPasswordPopupComponent } from 'app/modules/shared/forgot-password-popup/forgot-password-popup.component';
import { SecureImagePipe } from 'app/pipe/secure-image.pipe';
import { AuthService } from 'app/service/auth.service';
import { StorageService } from 'app/service/storage.service';
import { UserService } from 'app/service/user.service';
import { UtilService } from 'app/service/util.service';
import { environment } from 'environments/environment';
import { jwtDecode } from "jwt-decode";
declare const google: any;

export type FuseAlertAppearance =
    | 'border'
    | 'fill'
    | 'outline'
    | 'soft';

export type FuseAlertType =
    | 'primary'
    | 'accent'
    | 'warn'
    | 'basic'
    | 'info'
    | 'success'
    | 'warning'
    | 'error';


@Component({
    selector: 'app-login',
    imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule, SecureImagePipe, AsyncPipe],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm!: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signInForm!: UntypedFormGroup;
    showAlert: boolean = false;
    companyLogo: string | any;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _matSnackBar: MatSnackBar,
        private _utilService: UtilService,
        private _userService: UserService,
        private _storageService: StorageService,
        private _router: Router,
        private dialog: MatDialog
    ) {
    }

    ngOnInit(): void {
        this.companyLogo = this._storageService.getLogo();

        // Create the form
        this.signInForm = this._formBuilder.group({
            email: ['', [Validators.required]],
            password: ['', Validators.required],
        });

        
    }

    initializeGoogleSignIn() {
        // debugger
        google.accounts.id.initialize({
            client_id: environment.GOOGLE_KEY,
            callback: this.handleCredentialResponse.bind(this)
        });

        google.accounts.id.prompt();
    }

    triggerGoogleSignIn() {
        this.initializeGoogleSignIn();
        google.accounts.id.prompt((notification: any) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                // Try manual rendering
                google.accounts.id.renderButton(
                    document.getElementById("googleLoginButton"),
                    { theme: "outline", size: "large", text: "continue_with" }
                );
            }
        });
    }

    async handleCredentialResponse(response: any) {
        try {
            const decodedResponse: any = jwtDecode(response.credential);
    
            const payload = {
                name : decodedResponse.name,
                email: decodedResponse.email,
                email_verified: decodedResponse.email_verified,
            };
            const result = await this._authService.googleLogin(payload);
            this._utilService.loginUser(result);
            this._router.navigate(['/home']);
        } catch (error:any) {
            this._utilService.showErrorSnack(this._matSnackBar, error.error.message);
        }

    }

    async signIn() {
        if (this.signInForm.valid) {
            try {
                this.signInForm.disable();
                const response = await this._authService.signIn(this.signInForm.value);
                this._utilService.loginUser(response);
                // const initRoute = this._userService.getInitialRouteAccess();
                // const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || initRoute;
                this._router.navigate(['/home']);
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
}
