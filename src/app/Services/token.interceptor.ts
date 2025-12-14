import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service'; 
import { catchError, switchMap, throwError } from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {

  const authService = inject(AuthService);
  const accessToken = authService.getAcessToken();

  let authReq = req;

  // Add token to header
  if (accessToken) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {

      // If token expired
      if (error.status === 401) {

        return authService.refreshToken().pipe(

          switchMap((res: any) => {
            const newToken = res.token;

            // retry request with new token
            const retryReq = authReq.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`
              }
            });

            return next(retryReq);
          }),

          catchError((refreshErr) => {
            authService.logout();
            return throwError(() => refreshErr);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
