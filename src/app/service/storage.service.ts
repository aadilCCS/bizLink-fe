import { Injectable } from '@angular/core';
import { StorageConst } from '../config';
import { User } from '../models/user';
import { CompanySettings } from 'app/models/company';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

	storageApi = window.localStorage // sessionStorage;

	constructor() { }

	getItem(key: string): any {
		let item = this.storageApi.getItem(key);
		return item ? JSON.parse(item) : null
	}

	setItem(key: string, value: any) {
		this.storageApi[key] = JSON.stringify(value);
	}

	removeItem(key: string) {
		this.storageApi.removeItem(key);
	}

	getSessionToken(): string | null {
		return this.getItem(StorageConst.TOKEN);
	}

	setSessionToken(token: string) {
		this.setItem(StorageConst.TOKEN, token);
	}

	setCurrentUser(user: User) {
		this.setItem(StorageConst.CURRENT_USER, user);
	}

	getCurrentUser(): User | null {
		return this.getItem(StorageConst.CURRENT_USER);
	}

	getLogo(): string | null {
		return this.getItem(StorageConst.COMPANY_LOGO);
	}

	setCompanyDetails(companySetting: CompanySettings) {
		this.setItem(StorageConst.COMPANY_DETAILS, companySetting);
		this.setItem(StorageConst.COMPANY_LOGO, companySetting.companyLogo);
	}

	getCompanyDetails(): CompanySettings | null {
		return this.getItem(StorageConst.COMPANY_DETAILS);
	}

	clearLocalStorage() {
		this.storageApi.removeItem(StorageConst.CURRENT_USER);
		this.storageApi.removeItem(StorageConst.TOKEN);
		this.storageApi.removeItem(StorageConst.COMPANY_DETAILS);
	}
}

