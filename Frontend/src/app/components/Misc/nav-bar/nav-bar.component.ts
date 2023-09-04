import { Component } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {

  isOpen: boolean = false;

  onShow() {

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
