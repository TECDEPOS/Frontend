import { Component } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {

  constructor(private userService: UserService, private authService: AuthService) { }
  userId: number = 0;
  ngOnInit(){
    this.userId = this.authService.getUserId();
  }
  printUsers() {
    this.userService.getUsers().subscribe(res => {
      console.log(res);      
    })
  }

  printCurrentUser(){
    this.userService.getUsersById(this.userId).subscribe(res => {
      console.log(res);      
    })
  }

  logout(){
    this.authService.logout();
  }

}
