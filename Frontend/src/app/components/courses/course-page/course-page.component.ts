import { Component } from '@angular/core';

@Component({
  selector: 'app-course-page',
  templateUrl: './course-page.component.html',
  styleUrls: ['./course-page.component.css']
})
export class CoursePageComponent {
  activeComponent: string | null = null;
  activeTabIndex: number = 0;

  constructor() { }

  // Sets the active tab based on the provided index
  setActiveTab(index: number) {
    this.activeTabIndex = index;
  }

  // Toggles the active component between the specified component or null if already active
  toggleComponent(componentName: string) {
    if (this.activeComponent === componentName) {
      this.activeComponent = null;
    }
    else {
      this.activeComponent = componentName;
    }
  }

  // Checks if the specified form is the active component
  isActiveComponent(formName: string) {
    return this.activeComponent === formName;
  }


}
