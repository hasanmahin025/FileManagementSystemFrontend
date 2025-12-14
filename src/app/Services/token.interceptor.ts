import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from "rxjs"
import { AuthService } from "./auth.service";

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const tokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {

  const auth = inject(AuthService)
  const accessToken = auth.getAcessToken();

  if (req.url.includes('/login') || req.url.includes('/refresh-token')) {
    return next(req);
  }

  let authreq = req

  if (accessToken) {
    authreq = req.clone({
      setHeaders:
      {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  return next(authreq).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status !== 401) {
        return throwError(() => error);
      }
      //if one request process Another Request should be wait
      if (isRefreshing) {
        return refreshTokenSubject.pipe(
          filter(token => token !== null),
          take(1),
          switchMap(token =>
            next(
              req.clone({
                setHeaders: {
                  Authorization: `Bearer ${token}`
                }
              })
            )
          )
        );
      }
      isRefreshing = true;
      refreshTokenSubject.next(null);

      return auth.refreshToken().pipe(
        switchMap((res: any) => {
          isRefreshing = false;
          const newToken = res.token || res.accessToken;

          refreshTokenSubject.next(newToken);
          return next(
            req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`
              }
            })
          );
        }),
        catchError(err => {
          //logut
          isRefreshing = false;
          auth.logout();
          return throwError(() => err);
        })
      );
    })
  );
};




