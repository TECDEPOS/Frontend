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

// Retrieves the string representations of CourseType enums for display
courseTypes: string[] = (Object.values(CourseType) as Array<keyof typeof CourseType>)
  .filter(key => !isNaN(Number(CourseType[key])));

// Retrieves the string representations of Status enums for display
statuses: string[] = (Object.values(Status) as Array<keyof typeof Status>)
  .filter(key => !isNaN(Number(Status[key])));

// Constructor for AddPersonCourseComponent, initializes services and injects data
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
  }) {
  // Initialize course and currentPersons based on injected data
  if (data.course) this.course = data.course;
  if (data.persons) this.currentPersons = data.persons;
}

// Called on component initialization
ngOnInit() {
  this.getPersons();
}

// Retrieves persons who are not in the selected course
getPersons() {
  this.personService.getPersonNotInCourse(this.course.courseId).subscribe(res => {
    this.persons = res;
    console.log(res);
    console.log(this.persons);
  })
}

// Closes the dialog window
closeDialog() {
  this.dialogRef.close();
}

// Compares course start dates to today's date
compareStartDates(): boolean {
  let todaysDate = moment().utc();
  let startDate = moment(this.newPersonCourse.course?.startDate);
  return moment(startDate).isAfter(todaysDate, 'date');
}

// Compares course end dates to today's date
compareEndDates(): boolean {
  let todaysDate = moment().utc();
  let endDate = moment(this.newPersonCourse.course?.endDate);
  return moment(endDate).isAfter(todaysDate, 'date');
}

// Comparison function for dropdown selection
compareFn(optionValue: any, selectionValue: any): boolean {
  return optionValue === selectionValue;
}

// Submits the new person-course association
onSubmit() {
  const i = this.persons.indexOf(this.newPersonCourse.person!);
  console.log(this.newPersonCourse.person);

  // Add the newPersonCourse to the personCourses array
  this.newPersonCourse.person!.personCourses.unshift(this.newPersonCourse);
  this.currentPersons.push(this.newPersonCourse.person!);
  this.newPersonCourse.personId = this.newPersonCourse.person!.personId;
  this.newPersonCourse.courseId = this.course.courseId;
  this.newPersonCourse.course = null!;
  this.newPersonCourse.person = null!;

  this.personCourseService.addPersonCourse(this.newPersonCourse).subscribe(res => {
    this.persons.splice(i, 1);
    this.newPersonCourse = new PersonCourse();
  });
}

// Returns the course type name based on the CourseType enum
getCourseTypeName(courseType: CourseType): string {
  return CourseType[courseType];
}

}