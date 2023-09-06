import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-error-popup',
  templateUrl: './error-popup.component.html',
  styleUrls: ['./error-popup.component.css']
})
export class ErrorPopupComponent {
  message: string = 'An unspecified error has occurred';
  icon: string = '';
  buttonText = 'Ok';
  sessionExpired: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: {
      message: string;
      icon: string;
      buttonText: string;
      sessionExpired: boolean;
    },
    private dialogRef: MatDialogRef<ErrorPopupComponent>, private authService: AuthService
  ) {
    if (data?.icon) this.icon = data.icon;
    if (data?.message) this.message = data.message;
    if (data?.buttonText) this.buttonText = data.buttonText;
    if (data?.sessionExpired) this.sessionExpired = data.sessionExpired;
  }

  ngOninit(): void{
    this.disable()
    console.log("Hej");
    
  }
  closeDialog() {
    if (this.sessionExpired === true) {
      this.dialogRef.close();
      this.authService.logout();
      this.enable
    }
    else{
      this.dialogRef.close();
      this.enable
    }
  }

  disable()
{
 document.onkeydown = function (e) 
 {
  return false;
 }
}
enable()
{
 document.onkeydown = function (e) 
 {
  return true;
 }
}
}
