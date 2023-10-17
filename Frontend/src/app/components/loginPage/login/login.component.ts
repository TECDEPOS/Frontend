import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticatedResponse } from 'src/app/Models/ViewModels/AuthenticatedResponse';
import { LoginViewModel } from 'src/app/Models/ViewModels/LoginViewModel';
import { AuthService } from 'src/app/Services/auth.service';
import { PasswordExpiredPopupComponent } from '../../pop-ups/password-expired-popup/password-expired-popup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private authService: AuthService, private router: Router, private dialog: MatDialog) { }

  invalidLogin: boolean = false;
  loginRequest: LoginViewModel = new LoginViewModel;

  submitLogin(): void {
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
          this.checkPasswordExpiryDate(response.passwordExpiryDate);
        },
        error: (err: HttpErrorResponse) => this.invalidLogin = true
      })
  }

  checkPasswordExpiryDate(passwordExpiryDate: Date) {
    // Get today's date
    let today = new Date;
    // Get the expired date to compare, using 'new Date()' because the parameter is actually a string even if it says Date
    let passwordExpiredDate = new Date(passwordExpiryDate);
    console.log('old PasswordExpiredDate: ', passwordExpiredDate);
    console.log('todays Date: ', today);
    

    // Check if user's password is expired.
    if (passwordExpiredDate < today) {
      this.openPasswordExpiredDialog();
    }
  }

  openPasswordExpiredDialog() {
    this.dialog.open(PasswordExpiredPopupComponent, {
      disableClose: false,
    });
  }
}
