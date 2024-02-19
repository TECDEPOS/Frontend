import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-popup',
  templateUrl: './confirmation-popup.component.html',
  styleUrls: ['./confirmation-popup.component.css']
})
export class ConfirmationPopupComponent {
  message: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: {
      message: string;
    },
    private dialogRef: MatDialogRef<ConfirmationPopupComponent>) {if (data?.message) this.message = data.message;}

  confirmClicked() {
    this.dialogRef.close(true);
  }

  cancelClicked() {
    this.dialogRef.close(false);
  }
}
