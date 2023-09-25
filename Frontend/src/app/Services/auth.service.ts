import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginViewModel } from '../Models/ViewModels/LoginViewModel';
import { AuthenticatedResponse } from '../Models/ViewModels/AuthenticatedResponse';
import { changePasswordViewModel } from '../Models/ViewModels/ChangePasswordViewModel';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private route: Router) { }

  baseApiUrl: string = environment.baseApiUrl;
  extendedApiUrl: string = "Auth/"

  login(loginViewModel: LoginViewModel): Observable<AuthenticatedResponse>{
    return this.http.post<AuthenticatedResponse>(this.baseApiUrl + this.extendedApiUrl + 'login', loginViewModel)
  }

  logout(){
    localStorage.clear();
    this.route.navigate(['/login'])
  }

  changePassword(viewModel: changePasswordViewModel): Observable<boolean>{
    return this.http.put<boolean>(this.baseApiUrl + this.extendedApiUrl + 'changepassword', viewModel)
  }

  resetPassword(id: number): Observable<boolean>{
    return this.http.put<boolean>(this.baseApiUrl + this.extendedApiUrl + 'resetpassword/', id)
  }

  renewToken(authResponse: AuthenticatedResponse): Observable<AuthenticatedResponse>{
    return this.http.post<AuthenticatedResponse>(this.baseApiUrl + this.extendedApiUrl + 'refresh', authResponse)
  }

  storeAccessToken(tokenValue: string){
    localStorage.setItem('jwt', tokenValue);
  }

  storeRefreshToken(tokenValue: string){
    localStorage.setItem('refreshToken', tokenValue);
  }

  getAccessToken(){
    return localStorage.getItem('jwt');
  }

  getRefreshToken(){
    return localStorage.getItem('refreshToken');
  }

  getUserId(): number{
    let token = localStorage.getItem('jwt')!;
    var decoded: any = jwt_decode(token)    
    return Number(decoded['userId']);    
  }

  getName(): string{
    let token = localStorage.getItem('jwt')!;
    var decoded: any = jwt_decode(token)    
    localStorage.setItem('name', decoded['name'])
    return (decoded['name']);    
  }

  getRole(): string{
    let token = localStorage.getItem('jwt')!;
    var decoded: any = jwt_decode(token) 
    localStorage.setItem('userRole', decoded['role'])
    return (decoded['userRole']);    
  }
}
