import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { changePasswordViewModel } from 'src/app/Models/ViewModels/ChangePasswordViewModel';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-change-password-popup',
  templateUrl: './change-password-popup.component.html',
  styleUrls: ['./change-password-popup.component.css']
})
export class ChangePasswordPopupComponent {
  changePasswordModel: changePasswordViewModel = new changePasswordViewModel
  constructor(private dialogRef: MatDialogRef<ChangePasswordPopupComponent>, private authService: AuthService){}
  
  ngOnInit(){
    this.changePasswordModel.userId = this.authService.getUserId()
  }

  closeDialog() {
    this.dialogRef.close();
  }

  changepassword(){
    this.authService.changePassword(this.changePasswordModel).subscribe(value =>{
      console.log(value);
      this.dialogRef.close();
    })
  }
}
