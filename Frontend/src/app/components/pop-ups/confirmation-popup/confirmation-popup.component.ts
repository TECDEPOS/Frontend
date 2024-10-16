import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-popup',
  templateUrl: './confirmation-popup.component.html',
  styleUrls: ['./confirmation-popup.component.css']
})
export class ConfirmationPopupComponent {
  message: string = '';

  // Constructor for initializing the component with injected data
constructor(
  @Inject(MAT_DIALOG_DATA)
  private data: {
    message: string;
  },
  private dialogRef: MatDialogRef<ConfirmationPopupComponent>
) {
  // Assigns the message if it exists in the provided data
  if (data?.message) this.message = data.message;
}

// Closes the dialog with a confirmation (true) when confirm is clicked
confirmClicked() {
  this.dialogRef.close(true);
}

// Closes the dialog with a cancellation (false) when cancel is clicked
cancelClicked() {
  this.dialogRef.close(false);
}

}
