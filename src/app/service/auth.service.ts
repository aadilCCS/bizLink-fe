import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiUrls } from 'app/config';
import { LoginUser } from 'app/models/login-user';
import { Observable, lastValueFrom, of } from 'rxjs';
import { StorageService } from './storage.service';
import { Utils } from 'app/utils';
import { UtilService } from './util.service';

interface Credential {
    email :string;
    name : string;
    email_verified: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private _httpClient: HttpClient,
        private _storageService: StorageService,
        private _utilService: UtilService,
    ) {
    }

    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    signIn(credentials: { gstNo: string; password: string }): Promise<LoginUser> {
        return lastValueFrom(this._httpClient.post<LoginUser>(ApiUrls.LOGIN_USER, credentials));
    }

    signOut() {
        this._storageService.clearLocalStorage();
        this._utilService.loginChangeObx.next(null);
    }

    signUp(user: { name: string; email: string; password: string; company: string }): Observable<any> {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    unlockSession(credentials: { email: string; password: string }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    googleLogin(payload: Credential): Promise<any> {
        return lastValueFrom(this._httpClient.post<any>(ApiUrls.GOOGLE_LOGIN, payload));
    }

    check(): Observable<boolean> {

        let accessToken = this._storageService.getSessionToken();

        // Check the access token availability 
        if (!accessToken) {
            return of(false);
        }

        //and token expire date
        if (Utils.isTokenExpired(accessToken)) {
            return of(false);
        }

        return of(true);
    }
}
