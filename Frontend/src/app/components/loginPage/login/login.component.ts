import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticatedResponse } from 'src/app/Models/ViewModels/AuthenticatedResponse';
import { LoginViewModel } from 'src/app/Models/ViewModels/LoginViewModel';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private authService: AuthService, private router: Router) {}

  invalidLogin: boolean = false;
  loginRequest: LoginViewModel = new LoginViewModel;

  submitLogin(): void{
    this.authService.login(this.loginRequest)
    .subscribe({
      next: (response: AuthenticatedResponse) => {
        this.authService.storeAccessToken(response.accessToken);
        this.authService.storeRefreshToken(response.refreshToken);
        this.invalidLogin = false;
        this.authService.getUserId();
        this.authService.getName();
        this.authService.getRole();
        this.router.navigate(['/home'])
      },
      error: (err: HttpErrorResponse) => this.invalidLogin = true
    })
  }
}
