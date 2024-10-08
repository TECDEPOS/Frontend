import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBar } from '@angular/material/snack-bar';
import { Person } from 'src/app/Models/Person';

@Component({
  selector: 'app-snackbar-indicator',
  templateUrl: './snackbar-indicator.component.html',
  styleUrls: ['./snackbar-indicator.component.css']
})
export class SnackbarIndicatorComponent {

  message: string = '';
  icon: string = '';

  // Constructor that injects snackbar data (message and icon)
  constructor(@Inject(MAT_SNACK_BAR_DATA) private data: { message: string, icon: string }) {
    // If message is provided, assign it to the message property
    if (data.message) this.message = data.message;

    // If icon is provided, assign it to the icon property
    if (data.icon) this.icon = data.icon;
  }

}
