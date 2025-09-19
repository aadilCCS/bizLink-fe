import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError, finalize } from 'rxjs';
import { StorageService } from '../service/storage.service';
import { Utils } from 'app/utils';
import { AuthService } from 'app/service/auth.service';
import { LoaderService } from 'app/service/loader.service';

/**
 * Intercept
 *
 * @param req
 * @param next
 */
export const appInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    const authService = inject(AuthService);
    const storageService = inject(StorageService);
    const _router = inject(Router);
    const loaderService = inject(LoaderService);

    loaderService.show();

    req = req.clone({
        headers: req.headers.set('lang', 'en')
    });

    if (req.headers.has('fileUpload')) {
        req = req.clone({
            headers: req.headers.delete('fileUpload')
        });
        req = req.clone({
            headers: req.headers.set('Accept', '*/*')
        });
    } else if (req.headers.has('html')) {
        req = req.clone({
            headers: req.headers.delete('html')
        });
        req = req.clone({
            headers: req.headers.set('Content-Type', 'text/html')
        });
        req = req.clone({
            headers: req.headers.set('Accept', '*/*')
        });
    } else {
        if (!req.headers.has('Content-Type')) {
            req = req.clone({
                headers: req.headers.set('Content-Type', 'application/json')
            });
        }
    }

    const authToken = storageService.getSessionToken();
    if (authToken && !Utils.isTokenExpired(authToken)) {
        req = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${authToken}`)
        });
    }


    return next(req).pipe(
        catchError((error: any) => {
            if (error instanceof HttpErrorResponse) {
                if (error instanceof HttpErrorResponse && error.status === 401) {
                    // Sign out
                    authService.signOut();
                    _router.navigate(['sign-out']);
                }
            }
            return throwError(() => error);
        }),
        finalize(() => {
            loaderService.hide();
        })
    );
};
