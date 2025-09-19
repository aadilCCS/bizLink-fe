import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { StorageService } from './storage.service';
import { User } from '../models/user';
import { LoginUser } from '../models/login-user';
import { CompanySettings } from 'app/models/company';
import { AddToCartService } from './add-to-cart.service';
import { GeneralService } from './general.service';
import { RoleAccessControl } from 'app/models/roleAccessControl';
import { ApiUrls } from 'app/config';

interface HeaderCount {
    cartCount: number
}

@Injectable({
    providedIn: 'root'
})
export class UtilService {
    public loggedinUserDetail = localStorage.getItem("currentUser") ? JSON.parse(localStorage.getItem("currentUser") ?? '') : null;
    public loggedinUserToken = localStorage.getItem("accessToken") || '';
    public loginChangeObx: BehaviorSubject<User | null>;
    public headerCountObx: BehaviorSubject<HeaderCount | null>;
    public companySettingChangeObx: BehaviorSubject<CompanySettings | null>;

    constructor(private storageService: StorageService, private _generalService: GeneralService , private http: HttpClient) {
        this.loginChangeObx = new BehaviorSubject<User | null>(this.storageService.getCurrentUser());
        this.headerCountObx = new BehaviorSubject<HeaderCount | null>(null);
        this.companySettingChangeObx = new BehaviorSubject<CompanySettings | null>(this.storageService.getCompanyDetails());
    }

    updateUserProfile(user: User) {
        this.storageService.setCurrentUser(user);
        this.loginChangeObx.next(user);
    }

    async headerCount() {
        const response = await this._generalService.getHeaderCount();
        this.headerCountObx.next(response);
    }

    loginUser(rUser: LoginUser) {
        this.storageService.setSessionToken(rUser.token);
        this.storageService.setCurrentUser(rUser.user);
        this.loginChangeObx.next(rUser.user);
    }

    setCompanyDetails(companySetting: CompanySettings) {
        this.storageService.setCompanyDetails(companySetting);
        this.companySettingChangeObx.next(companySetting);
    }

    formatString(str: string, ...val: string[]) {
        for (let index = 0; index < val.length; index++) {
            str = str.replace(`{${index}}`, val[index]);
        }
        return str;
    }

    showSuccessSnack(matSnackBar: MatSnackBar, message: string, duration: number = 5000): void {
        if (message) {
            matSnackBar.open(message, undefined, {
                duration: duration,
                panelClass: ['green-snackbar'],
                horizontalPosition: 'center',
                verticalPosition: 'top',
            });
        }
    }

    showErrorSnack(matSnackBar: MatSnackBar, message: string, duration: number = 5000): void {
        if (!message) {
            message = 'We encountered an issue. Please try again later.';
        }

        matSnackBar.open(message, undefined, {
            duration: duration,
            panelClass: ['red-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'top',
        });
    }

    public saveAsFile(data: HttpResponse<Blob>, name: string): void {
        const blob = data.body;
        const url = window.URL.createObjectURL(blob ?? new Blob());
        const anchor = document.createElement('a');
        anchor.download = name;
        anchor.href = url;
        anchor.click();
    }

    // New utility function to convert object to array of model objects
    convertObjectToModelArray(obj: { [key: string]: number }): { modelId: string; quantity: number }[] {
        return Object.entries(obj).map(([modelId, quantity]) => ({
            modelId,
            quantity
        }));
    }

    public async getRoleById(id: string): Promise<RoleAccessControl> {
        const result = await lastValueFrom(this.http.get<RoleAccessControl>(`${ApiUrls.ROLE}/${id}`));
        return result;
    }
}
