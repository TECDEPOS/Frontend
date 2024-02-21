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

  constructor(@Inject(MAT_SNACK_BAR_DATA) private data: {message:string}){
    if(data.message) this.message = data.message;
  }
}
