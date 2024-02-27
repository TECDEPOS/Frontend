import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { Course } from 'src/app/Models/Course';
import { CourseType } from 'src/app/Models/CourseType';
import { Module } from 'src/app/Models/Module';
import { Person } from 'src/app/Models/Person';
import { PersonCourse } from 'src/app/Models/PersonCourse';
import { Status } from 'src/app/Models/Status';
import { CourseService } from 'src/app/Services/course.service';
import { ModuleService } from 'src/app/Services/module.service';
import { PersonCourseService } from 'src/app/Services/person-course.service';
import { AddPersonCourseComponent } from '../add-person-course/add-person-course.component';
import { PersonsService } from 'src/app/Services/persons.service';

@Component({
  selector: 'app-add-person-to-course',
  templateUrl: './add-person-to-course.component.html',
  styleUrls: ['./add-person-to-course.component.css']
})
export class AddPersonToCourseComponent {
  moduleSelected: boolean = false;
  newPersonCourse: PersonCourse = new PersonCourse;
  course: Course = new Course;
  persons: Person[] = [];
  currentPersons: Person[] = [];

  courseTypes: string[] = (Object.values(CourseType) as Array<keyof typeof CourseType>)
    .filter(key => !isNaN(Number(CourseType[key])));

  statuses: string[] = (Object.values(Status) as Array<keyof typeof Status>)
    .filter(key => !isNaN(Number(Status[key])));

  constructor(
    private dialogRef: MatDialogRef<AddPersonCourseComponent>,
    private courseService: CourseService,
    private personCourseService: PersonCourseService,
    private personService: PersonsService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA)
    private data: {
      course: Course;
      persons: Person[];
      inactiveCourses: PersonCourse[];
    }) {
    if (data.course) this.course = data.course;
    if (data.persons) this.currentPersons = data.persons;
  }

  ngOnInit() {
    this.getPersons();
    
    
  }

  getPersons() {
    this.personService.getPersons().subscribe(res => {
      this.persons = res;
      console.log(res);
      console.log(this.persons);
    })
  }

  closeDialog() {
    this.dialogRef.close();
  }

  compareStartDates(): boolean {
    let todaysDate = moment().utc();
    let startDate = moment(this.newPersonCourse.course?.startDate);
    let startDateAfterToday = moment(startDate).isAfter(todaysDate, 'date');

    return startDateAfterToday
  }

  compareEndDates(): boolean {
    let todaysDate = moment().utc();
    let endDate = moment(this.newPersonCourse.course?.endDate);
    let startDateAfterToday = moment(endDate).isAfter(todaysDate, 'date');

    return startDateAfterToday
  }


// Add this method in your component class
compareFn(optionValue: any, selectionValue: any): boolean {
  return optionValue === selectionValue;
}

onSubmit() {
  this.currentPersons.push(this.newPersonCourse.person!);
  this.newPersonCourse.personId = this.newPersonCourse.person!.personId;
  this.newPersonCourse.courseId = this.course.courseId;
  this.newPersonCourse.course = null!;
  this.newPersonCourse.person = null!;

  this.personCourseService.addPersonCourse(this.newPersonCourse).subscribe(res => {
  });
}

getCourseTypeName(courseType: CourseType): string {
  return CourseType[courseType];
}
}
