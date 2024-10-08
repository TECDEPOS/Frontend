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

    // Handle login submission and authentication process
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
            this.router.navigate(['/home']);
            this.checkPasswordExpiryDate(response.passwordExpiryDate);
          },
          error: (err: HttpErrorResponse) => this.invalidLogin = true
        })
    }
  
    // Check if the user's password has expired by comparing the expiry date to the current date
    checkPasswordExpiryDate(passwordExpiryDate: Date) {
      // Get today's date
      let today = new Date();
      // Parse the password expiry date from string to Date
      let passwordExpiredDate = new Date(passwordExpiryDate);
      console.log('old PasswordExpiredDate: ', passwordExpiredDate);
      console.log('todays Date: ', today);
  
      // Check if user's password is expired
      if (passwordExpiredDate < today) {
        this.openPasswordExpiredDialog();
      }
    }
  
    // Open the password expired dialog component
    openPasswordExpiredDialog() {
      this.dialog.open(PasswordExpiredPopupComponent, {
        disableClose: false,
      });
    }
  
}
