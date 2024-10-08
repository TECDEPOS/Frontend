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

  constructor(private authService: AuthService, private dialog: MatDialog, public router: Router) { }
  isOpen: boolean = false;
  name: string = "";
  role: string = "";

  // Initialize component and get user name and role from local storage
  ngOnInit() {
    // console.log(this.authService.getName());
    this.name = String(localStorage.getItem('name'));
    this.role = this.authService.getUserRole().replaceAll('_', ' ');
  }

  // Detect changes in the component
  ngOnChange() {
    this.name;
  }

  // Split the role string into individual characters
  test(role: string) {
    role.split("");
  }

  // Log out the user
  logout() {
    this.authService.logout();
  }

  // Toggle dropdown visibility
  onShow() {
    if (!this.isOpen) {
      document.getElementById('dropdown-content')!.style.display = "flex";
      this.isOpen = true;
    } else {
      document.getElementById('dropdown-content')!.style.display = "none";
      this.isOpen = false;
    }
  }

  // Open the change password popup dialog
  openChangePasswordPopup() {
    this.dialog.open(ChangePasswordPopupComponent, {});
  }

}
