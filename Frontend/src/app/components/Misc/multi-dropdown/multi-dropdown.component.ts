import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-multi-dropdown',
  templateUrl: './multi-dropdown.component.html',
  styleUrls: ['./multi-dropdown.component.css']
})
export class MultiDropdownComponent {
  @Input() values: any[] = [];
  @Input() label: string = '';
  @Input() isFileTag: boolean = false;

  @Output() selectionChanged: EventEmitter<any> = new EventEmitter<any>();

  everything: any = 'Alle'
  selectionValues: any[] = [];
  previousSelection: any[] = [];
  searchTerm: string = '';
  filteredValues: any[] = [];

  ngOnChanges(){
    this.previousSelection = JSON.parse(JSON.stringify(this.values));
    this.filteredValues = this.values;
  }

  resetSelectionValues(){
    this.selectionValues = [];
    this.previousSelection = [];
  }

  onSelectionChanged(): void {
    const isEverythingSelected = this.selectionValues.includes(this.everything);
    const wasEverythingSelected = this.previousSelection.includes(this.everything);

    // Check if 'Everything' was the last selected value
    if (isEverythingSelected && !wasEverythingSelected) {
      // Remove everything except 'Alle' if 'Alle' is selected and it wasn't before
      this.selectionValues = this.selectionValues.filter(value => value === this.everything);
      this.selectionChanged.emit([]);
    }
    else if (wasEverythingSelected && this.selectionValues.length > 1) {
      // Remove 'Alle' selection if it's selected and something else is selected
      this.selectionValues = this.selectionValues.filter(value => value !== this.everything);
      this.selectionChanged.emit(this.selectionValues);
    }
    else{
      this.selectionChanged.emit(this.selectionValues); 
    }

    // Update the previous selection state
    this.previousSelection = this.selectionValues;
  }

  onSearchChanged(){    
    if (this.searchTerm === '') {
      this.filteredValues = this.values;
    }
    else{
      this.filteredValues = this.values.filter(item => item.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
    }
  }
}