import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginViewModel } from '../Models/ViewModels/LoginViewModel';
import { AutehnticatedResponse } from '../Models/ViewModels/AuthenticatedResponse';
import { changePasswordViewModel } from '../Models/ViewModels/ChangePasswordViewModel';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  baseApiUrl: string = environment.baseApiUrl;
  extendedApiUrl: string = "Auth/"

  addLogin(loginViewModel: LoginViewModel): Observable<AutehnticatedResponse>{
    return this.http.post<AutehnticatedResponse>(this.baseApiUrl + this.extendedApiUrl + 'login', loginViewModel)
  }

  changePassword(viewModel: changePasswordViewModel): Observable<boolean>{
    return this.http.put<boolean>(this.baseApiUrl +this.extendedApiUrl + 'changepassword', viewModel)
  }

  addRefreshToken(authResponse: AutehnticatedResponse): Observable<AutehnticatedResponse>{
    return this.http.post<AutehnticatedResponse>(this.baseApiUrl + this.extendedApiUrl + 'refresh', authResponse)
  }
}
