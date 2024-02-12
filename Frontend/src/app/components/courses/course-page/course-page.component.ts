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

  setActiveTab(index: number) {
    this.activeTabIndex = index;
  }

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
