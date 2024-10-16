import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Module } from 'src/app/Models/Module';
import { CourseType } from 'src/app/Models/CourseType';
import { Course } from 'src/app/Models/Course';
import { Status } from 'src/app/Models/Status';
import { ModuleService } from 'src/app/Services/module.service';
import { CourseService } from 'src/app/Services/course.service';
import { PersonCourse } from 'src/app/Models/PersonCourse';
import { PersonCourseService } from 'src/app/Services/person-course.service';

@Component({
  selector: 'app-edit-personCourse-popup',
  templateUrl: './edit-personmodule-popup.component.html',
  styleUrls: ['./edit-personmodule-popup.component.css']
})
export class EditPersonmodulePopupComponent {
  tempPersonCourse: PersonCourse = new PersonCourse;
  personCourse: PersonCourse = new PersonCourse;
  currentPersoncourse: PersonCourse[] = [];
  inactiveModules: PersonCourse[] = [];
  test = "hej"
  modules: Module[] = [];
  courseType: CourseType = 0

  // Filters and initializes module types from CourseType enum
  moduleTypes: string[] = (Object.values(CourseType) as Array<keyof typeof CourseType>)
    .filter(key => !isNaN(Number(CourseType[key])));

  // Filters and initializes statuses from Status enum
  statuses: string[] = (Object.values(Status) as Array<keyof typeof Status>)
    .filter(key => !isNaN(Number(Status[key])));

  // Constructor to initialize component with injected data
  constructor(
    private dialogRef: MatDialogRef<EditPersonmodulePopupComponent>,
    private moduleService: ModuleService,
    private personCourseService: PersonCourseService,
    @Inject(MAT_DIALOG_DATA) private data: {
      personCourse: PersonCourse;
      currentPersonCourses: PersonCourse[];
      inactiveModules: PersonCourse[];
    }) {
    // Assigns the injected data to the component variables
    if (data.personCourse) this.personCourse = data.personCourse;
    if (data.currentPersonCourses) this.currentPersoncourse = data.currentPersonCourses;
  }

  // Lifecycle hook to run initialization logic
  ngOnInit() {
    console.log(this.personCourse);
    this.tempPersonCourse = JSON.parse(JSON.stringify(this.personCourse));
    this.getModules();
  }

  // Fetches the list of modules from the module service
  getModules() {
    this.moduleService.getModules().subscribe(res => {
      this.modules = res;
      console.log(this.modules);
    });
  }

  // ToDo: Omskriv
  // Submits changes to the personCourse and updates arrays for current or inactive modules
  onSubmit() {
    this.personCourseService.updatePersonCourse(this.tempPersonCourse).subscribe(res => {

      // If old and edited personCourse is "Startet" then replace the old with edited in injected currentModules variable to update immediately
      if ((this.personCourse.status === 1 && this.tempPersonCourse.status === 1)) {
        this.currentPersoncourse.splice(this.currentPersoncourse.indexOf(this.personCourse), 1, this.tempPersonCourse);
      }

      // If old and edited personCourse is -NOT- "Startet" then replace the old with edited in injected inactiveModules variable to update immediately
      if ((this.personCourse.status !== 1 && this.tempPersonCourse.status !== 1)) {
        this.currentPersoncourse.splice(this.currentPersoncourse.indexOf(this.personCourse), 1, this.tempPersonCourse);
      }

      // If status has changed FROM "Startet", Remove old personCourse from currentModules and add the updated one to inactiveModules
      if (this.personCourse.status === 1 && this.tempPersonCourse.status !== 1) {
        this.currentPersoncourse.splice(this.currentPersoncourse.indexOf(this.personCourse), 1, (this.tempPersonCourse));
      }

      // If status has changed TO "Startet", Remove old personCourse from inactiveModules and add the updated one to currentModules
      if (this.personCourse.status !== 1 && this.tempPersonCourse.status === 1) {
        this.currentPersoncourse.splice(this.currentPersoncourse.indexOf(this.personCourse), 1, this.tempPersonCourse)
      }
      this.closeDialog();
    })
  }

  // ToDo: Omskriv
  // Deletes the selected personCourse
  deletepersonCourse() {
    this.personCourseService.deletePersonCourse(this.personCourse.personId, this.personCourse.courseId!).subscribe(res => {
      this.currentPersoncourse.splice(this.currentPersoncourse.indexOf(this.personCourse), 1)
      this.closeDialog();
    });
  }

  // Closes the dialog
  closeDialog() {
    this.dialogRef.close();
  }

  // Compares two objects (primarily modules) to check if they are equal
  compareObjects(o1: any, o2: any): boolean {
    if (o2 == null) {
      return false;
    }

  // Compares based on module properties
    if (typeof (o2 == Module)) {
      return o1.name === o2.name && o1.moduleId === o2.moduleId;
    }
    else {
      return false;
    }
  }
}
