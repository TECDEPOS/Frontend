import { Component, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-crud-entity-page',
  templateUrl: './crud-entity-page.component.html',
  styleUrls: ['./crud-entity-page.component.css']
})
export class CrudEntityPageComponent {
  activeComponent: string | null = null; 

  constructor() {}

  toggleComponent(componentName: string) {
    if (this.activeComponent === componentName) {
      this.activeComponent = null
    }
    else {
      this.activeComponent = componentName
    }
  }

  isActiveComponent(formName: string) {
    return this.activeComponent === formName;
  }
}
