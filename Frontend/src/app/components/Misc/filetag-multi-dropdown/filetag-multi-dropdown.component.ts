import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FileTag } from 'src/app/Models/FileTag';

export interface VisibilityOption {
  property: string;
  displayName: string;
}

@Component({
  selector: 'app-filetag-multi-dropdown',
  templateUrl: './filetag-multi-dropdown.component.html',
  styleUrls: ['./filetag-multi-dropdown.component.css']
})
export class FiletagMultiDropdownComponent {
  @Input() fileTag!: FileTag;
  @Input() selectedVisibilityOptions: string[] = [];

  //selectedVisibilityOptions: string[] = [];
  visibilityOptions: VisibilityOption[] = [
    { property: 'controllerVisibility', displayName: 'Controller' },
    { property: 'educationLeaderVisibility', displayName: 'Uddannelsesleder' },
    { property: 'educationBossVisibility', displayName: 'Uddannelseschef' },
    { property: 'dkVisibility', displayName: 'Driftskoordinator' },
    { property: 'hrVisibility', displayName: 'Human Resources' },
    { property: 'pkVisibility', displayName: 'Pædagogisk Konsulent' },
  ];

  ngOnInit() {
    this.setInitialDropdownValues();
  }

  // Set true/false for visibility on fileTag object according to what has been selected in the dropdown.
  onVisibilityChange(selectedOptions: string[]) {
    this.selectedVisibilityOptions = selectedOptions;
    this.visibilityOptions.forEach((option) => {
      this.fileTag[option.property] = this.selectedVisibilityOptions.includes(option.property);
    });
  }

  setInitialDropdownValues(){
    // Set initially selected options in dropdown based on true values in the FileTag object
    this.selectedVisibilityOptions = this.visibilityOptions
      .filter((option) => this.fileTag[option.property])
      .map((option) => option.property);      
  }
}
