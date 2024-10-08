import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { changePasswordViewModel } from 'src/app/Models/ViewModels/ChangePasswordViewModel';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-password-expired-popup',
  templateUrl: './password-expired-popup.component.html',
  styleUrls: ['./password-expired-popup.component.css']
})
export class PasswordExpiredPopupComponent {
  id:number = 999
  changePasswordModel: changePasswordViewModel = new changePasswordViewModel;
  constructor(private dialogRef: MatDialogRef<PasswordExpiredPopupComponent>, private authService: AuthService) {}

  ngOnInit(){
    this.changePasswordModel.userId = this.authService.getUserId()
    this.id = this.authService.getUserId();
  }

  // Close the dialog when called
closeDialog() {
  this.dialogRef.close();
}

// Change the user's password using the provided model
changepassword() {
  console.log(this.id); // Log the user ID
  console.log(this.changePasswordModel); // Log the change password model
  
  // Call the authentication service to change the password
  this.authService.changePassword(this.changePasswordModel).subscribe(value => {
      console.log(value); // Log the response from the service
      this.dialogRef.close(); // Close the dialog after changing the password
  });
}

}
