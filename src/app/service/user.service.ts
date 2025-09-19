import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { AccessControlList, User } from 'app/models/user';
import { Observable, ReplaySubject, lastValueFrom, map, tap } from 'rxjs';
import { StorageService } from './storage.service';
import { UtilService } from './util.service';
import { PaginationResponse } from '../models/pagination-response';
import { ApiUrls } from '../config';
import { AccessControlList, User } from '../models/user';
import { RoleAccessControl } from '../models/roleAccessControl';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

  accessWithRoute: Array<any> = [
    {
      access: 'all',
      route: ['dashboard']
    },
  ];

  constructor(
    private _utilService: UtilService,
    private _storageService: StorageService,
    private http: HttpClient,
  ) {
    this.observedUser();
  }

  observedUser() {
    this._utilService.loginChangeObx.subscribe((it) => {
      // this.user = it;
    });
  }

  set user(value: User) {
    this._user.next(value);
  }

  get user$(): Observable<User> {
    return this._user.asObservable();
  }

  // hasAccess(access: string | Array<string>): Boolean {
  //   const user = this._storageService.getCurrentUser();
  //   if (user.role == 'Super Admin') {
  //     return true;
  //   }
  //   if (typeof access === 'string') {
  //     if (user?.accessControls?.includes(access)) {
  //       return true;
  //     }
  //   } else {
  //     var hasAccess = false;
  //     access.map(e => {
  //       if (user?.accessControls?.includes(e)) {
  //         hasAccess = true;
  //       }
  //     });
  //     return hasAccess;
  //   }
  //   return false;
  // }

  // getInitialRouteAccess(): string {
  //   const user = this._storageService.getCurrentUser();
  //   var route = null;
  //   Const.accessWithRoute.map(e => {
  //     if ((user?.accessControls?.includes(e.access) || e.access == 'all') && !route) {
  //       route = e.route[0];
  //     }
  //   });
  //   return route ?? 'dashboard';
  // }

  getUserList(params: HttpParams): Promise<PaginationResponse<User>> {
    return lastValueFrom(this.http.get<PaginationResponse<User>>(ApiUrls.USERS, { params }));
  }

  getUserListAll(params: HttpParams): Promise<User[]> {
    return lastValueFrom(this.http.get<User[]>(ApiUrls.USERS, { params }));
  }

  createUser(payload: User): Promise<User> {
    return lastValueFrom(this.http.post<User>(ApiUrls.USERS, payload));
  }

  updateUser(userId: string, payload: any): Promise<User> {
    return lastValueFrom(this.http.patch<User>(`${ApiUrls.USERS}/${userId}`, payload));
  }

  getUserById(userId: string): Promise<User> {
    return lastValueFrom(this.http.get<User>(`${ApiUrls.USERS}/${userId}`));
  }

  deleteUser(userId: string): Promise<any> {
    return lastValueFrom(this.http.delete<any>(`${ApiUrls.USERS}/${userId}`));
  }

  getAccessControls(): Promise<AccessControlList> {
    return lastValueFrom(this.http.get<AccessControlList>(ApiUrls.ACCESS_CONTROLS));
  }
}

