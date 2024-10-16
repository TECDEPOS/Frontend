import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-error-popup',
  templateUrl: './error-popup.component.html',
  styleUrls: ['./error-popup.component.css']
})
export class ErrorPopupComponent {
  message: string = 'Der opstod en fejl.';
  icon: string = '';
  buttonText = 'Ok';
  sessionExpired: boolean = false;

  // Constructor to initialize the component with injected data
  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: {
      message: string;
      icon: string;
      buttonText: string;
      sessionExpired: boolean;
    },
    private dialogRef: MatDialogRef<ErrorPopupComponent>,
    private authService: AuthService
  ) {
    // Initializes icon if provided
    if (data?.icon) this.icon = data.icon;

    // Initializes message if provided
    if (data?.message) this.message = data.message;

    // Initializes buttonText if provided
    if (data?.buttonText) this.buttonText = data.buttonText;

    // Initializes sessionExpired flag if provided
    if (data?.sessionExpired) this.sessionExpired = data.sessionExpired;
  }

  // Lifecycle hook that runs on component initialization
  ngOninit(): void {
    this.disable();
  }

  // Closes the dialog and handles session expiration logic
  closeDialog() {
    if (this.sessionExpired === true) {
      this.dialogRef.close();
      this.authService.logout();
      this.enable();
    } else {
      this.dialogRef.close();
      this.enable();
    }
  }

  // Disables keyboard input by overriding the onkeydown event
  disable() {
    document.onkeydown = function (e) {
      return false;
    };
  }

  // Enables keyboard input by restoring the onkeydown event
  enable() {
    document.onkeydown = function (e) {
      return true;
    };
  }
}
