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
  name: string = "";
  role: string = "";

  ngOnInit(){
    console.log(this.authService.getName());
    
    this.name = String(localStorage.getItem('name'))
    this.role = String(localStorage.getItem('userRole')).replace('_', ' ')

  }

  ngOnChange(){
    this.name
  }

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
