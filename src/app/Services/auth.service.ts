import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "./environment";
import { Router } from "@angular/router";
import { Observable, tap } from "rxjs";



@Injectable({
  providedIn: 'root'
})

export class AuthService{
     
  private http = inject(HttpClient)
  private base = `${environment.apiUrl}/api/user-management`
  private router = inject(Router)

 //Token Works // set Method
  storeTokens(token: string , refreshToken: string){
    localStorage.setItem('token' , token);
    localStorage.setItem('refreshToken', refreshToken);

  }

  storeTwoFactorToken(token: string){
    localStorage.setItem('twoFactorToken' , token);
  }
  //get Method

  getAcessToken(){
    return localStorage.getItem('token');
  }

  getRefreshToken(){
    return localStorage.getItem('refreshToken');
  }
  getTwoFactorToken(){
    return localStorage.getItem('twoFactorToken');
  }
  
  clearAll(){
    localStorage.clear();
  }

  //login method

  login(credentials: any): Observable<any>{
    return this.http.post<any>(`${this.base}/login`,credentials)
    .pipe(
      tap(res => {
        //2Fa
        if(res.requires2FA){
          this.storeTwoFactorToken(res.twoFactorToken);
          this.router.navigate(['/2fa']);
          return;
        }
        //normal
        this.storeTokens(res.token , res.refreshToken);
        this.router.navigate(['/dashboard']);
      })
    );
  }

  verify2FA(code:string){
    const payload = {
      twoFactorToken: this.getTwoFactorToken(),
      code
    };
    return this.http.post<any>(`${this.base}/auth/2fa/login`, payload)
    .pipe(
      tap(res =>{
        this.storeTokens(res.token , res.refreshToken)
        localStorage.removeItem('twoFactorToken');
        this.router.navigate(['/dashboard']);
      })
    );
  }
    // refreshToken

    refreshToken(){
      const payload = {
        refreshToken: this.getRefreshToken()

      };
      return this.http.post<any>(`${this.base}/refresh-token`,payload)
      .pipe(
        tap(res =>
          this.storeTokens(res.token , res.refreshToken)
        )
      )
    }

    logout(){
      const refreshToken = this.refreshToken();
      this.clearAll();
      if(refreshToken){
        this.http.post(`${this.base}/revoke-token`,{refreshToken}).subscribe();

      }
      this.router.navigate(['/home'])
    }
    isLoggedIn(){
      return !!this.getAcessToken();
    }


}