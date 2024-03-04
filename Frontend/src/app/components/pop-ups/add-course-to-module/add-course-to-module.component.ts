import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { Course } from 'src/app/Models/Course';
import { CourseType } from 'src/app/Models/CourseType';
import { Module } from 'src/app/Models/Module';
import { Person } from 'src/app/Models/Person';
import { PersonCourse } from 'src/app/Models/PersonCourse';
import { CourseService } from 'src/app/Services/course.service';
import { ModuleService } from 'src/app/Services/module.service';
import { PersonCourseService } from 'src/app/Services/person-course.service';
import { AddPersonCourseComponent } from '../add-person-course/add-person-course.component';

@Component({
  selector: 'app-add-course-to-module',
  templateUrl: './add-course-to-module.component.html',
  styleUrls: ['./add-course-to-module.component.css']
})
export class AddCourseToModuleComponent {
  closeAfter: boolean = false;
  moduleSelected: boolean = false;
  newCourse: Course = new Course;
  module: Module = new Module;
  courses: Course[] = [];
  currentCourses: Course[] = [];

  courseTypes: string[] = (Object.values(CourseType) as Array<keyof typeof CourseType>)
    .filter(key => !isNaN(Number(CourseType[key])));

  constructor(
    private dialogRef: MatDialogRef<AddPersonCourseComponent>,
    private courseService: CourseService,
    private personCourseService: PersonCourseService,
    private moduleService: ModuleService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA)
    private data: {
      module: Module;
      currentCourses: Course[];
      closeAfter: boolean;
    }) {
    if (data.module) this.module = data.module;
    if (data.currentCourses) this.currentCourses = data.currentCourses;
  }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onSubmit() {    
    console.log(this.module);
    
    this.newCourse.moduleId = this.module.moduleId;

    console.log(this.newCourse);

    this.courseService.addCourses(this.newCourse).subscribe(res => {
      this.currentCourses.push(res)
    });
  }
}
