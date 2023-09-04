import { Component } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {

  constructor(private authService: AuthService) {}
  isOpen: boolean = false;

  logout(){
    this.authService.logout();
  }
  onShow(){

    if (!this.isOpen) {
      document.getElementById('dropdown-content')!.style.display = "block";
      this.isOpen = true;
    }
    else {
      document.getElementById('dropdown-content')!.style.display = "none";
      this.isOpen = false;
    }
  }
}
