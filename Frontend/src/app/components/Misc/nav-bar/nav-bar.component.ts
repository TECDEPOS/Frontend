import { Component } from '@angular/core';
import { changePasswordViewModel } from 'src/app/Models/ViewModels/ChangePasswordViewModel';
import { AuthService } from 'src/app/Services/auth.service';
import { ChangePasswordPopupComponent } from '../../pop-ups/change-password-popup/change-password-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {

  constructor(private authService: AuthService,  private dialog: MatDialog, public router: Router) {}
  isOpen: boolean = false;
  name: string = "";
  role: string = "";

  ngOnInit(){
    // console.log(this.authService.getName());
    this.name = String(localStorage.getItem('name'))
    this.role = this.authService.getUserRole().replaceAll('_', ' ')
  }

  ngOnChange(){
    this.name
  }

  test(role: string){
    role.split("")
  }

  logout(){
    this.authService.logout();
  }
  onShow(){

    if (!this.isOpen) {
      document.getElementById('dropdown-content')!.style.display = "flex";
      this.isOpen = true;
    }
    else {
      document.getElementById('dropdown-content')!.style.display = "none";
      this.isOpen = false;
    }
  }

  openChangePasswordPopup(){
    this.dialog.open(ChangePasswordPopupComponent, {
    })
  }
}
