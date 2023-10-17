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

  closeDialog() {
    this.dialogRef.close();
  }

  changepassword(){
    console.log(this.id);
    console.log(this.changePasswordModel);
    
    this.authService.changePassword(this.changePasswordModel).subscribe(value =>{
      console.log(value);
      this.dialogRef.close();
    })
  }
}
