import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'app/service/auth.service';
import { of, switchMap } from 'rxjs';

export const NoAuthGuard: CanActivateFn | CanActivateChildFn = (route, state) => {
    const router: Router = inject(Router);

    // Check the authentication status
    return inject(AuthService).check().pipe(
        switchMap((authenticated) => {
            // If the user is authenticated and not accessing register route...
            if (authenticated && state.url !== '/register' && state.url !== '/buyer-list') {
                return of(router.parseUrl('home'));
            }

            // Allow the access
            return of(true);
        }),
    );
};
