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

  ngOnChanges() {
    this.previousSelection = JSON.parse(JSON.stringify(this.values));
    this.filteredValues = this.values;
  }

  // Reset the selection values and previous selections
  resetSelectionValues() {
    this.selectionValues = [];
    this.previousSelection = [];
  }

  // Handle the changes in selection values
  onSelectionChanged(): void {
    const isEverythingSelected = this.selectionValues.includes(this.everything);
    const wasEverythingSelected = this.previousSelection.includes(this.everything);

    // Check if 'Everything' was selected now but wasn't selected before
    if (isEverythingSelected && !wasEverythingSelected) {
      // Keep only 'Everything' if selected, removing all other values
      this.selectionValues = this.selectionValues.filter(value => value === this.everything);
      this.selectionChanged.emit([]);
    }
    // If 'Everything' was previously selected but other selections are made, remove 'Everything'
    else if (wasEverythingSelected && this.selectionValues.length > 1) {
      this.selectionValues = this.selectionValues.filter(value => value !== this.everything);
      this.selectionChanged.emit(this.selectionValues);
    }
    else {
      // Emit the updated selection values
      this.selectionChanged.emit(this.selectionValues);
    }

    // Update the state of previous selections
    this.previousSelection = this.selectionValues;
  }

  // Filter the values based on the search term entered by the user
  onSearchChanged() {
    if (this.searchTerm === '') {
      // If no search term, show all values
      this.filteredValues = this.values;
    }
    else {
      // Filter values based on the search term entered by the user
      this.filteredValues = this.values.filter(item => item.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
    }
  }
}