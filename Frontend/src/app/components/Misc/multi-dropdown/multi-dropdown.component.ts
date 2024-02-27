import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Department } from 'src/app/Models/Department';

@Component({
  selector: 'app-multi-dropdown',
  templateUrl: './multi-dropdown.component.html',
  styleUrls: ['./multi-dropdown.component.css']
})
export class MultiDropdownComponent {
clearSelection() {
throw new Error('Method not implemented.');
}
  @Input() values: any[] = [];
  @Input() label: string = '';
  @Output() selectionChanged: EventEmitter<any> = new EventEmitter<any>();

  selectionValues: any[] = [];

  ngOnInit(){
    this.selectionValues = JSON.parse(JSON.stringify(this.values));
  }

  onSelectionChanged(){
    if (this.selectionValues.includes(null)) {
      this.selectionValues = [];
    }
    this.selectionChanged.emit(this.selectionValues);
  }
}
