import { Component, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-crud-entity-page',
  templateUrl: './crud-entity-page.component.html',
  styleUrls: ['./crud-entity-page.component.css']
})
export class CrudEntityPageComponent {
  activeComponent: string | null = null;
  activeTabIndex: number = 0;

  constructor() { }

// Sets the active tab based on the given index
setActiveTab(index: number) {
  this.activeTabIndex = index;
}

// Toggles the visibility of a specific component based on the component name
toggleComponent(componentName: string) {
  if (this.activeComponent === componentName) {
    this.activeComponent = null;
  } else {
    this.activeComponent = componentName;
  }
}

// Checks if the specified form is the active component
isActiveComponent(formName: string) {
  return this.activeComponent === formName;
}

}
