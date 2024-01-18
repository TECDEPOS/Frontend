import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { Module } from 'src/app/Models/Module';
import { CourseType } from 'src/app/Models/CourseType';
import { Person } from 'src/app/Models/Person';
import { Course } from 'src/app/Models/Course';
import { ModuleService } from 'src/app/Services/module.service';
import { CourseService } from 'src/app/Services/course.service';
import { PersonCourse } from 'src/app/Models/PersonCourse';
import { Status } from 'src/app/Models/Status';


@Component({
  selector: 'app-add-person-course',
  templateUrl: './add-person-course.component.html',
  styleUrls: ['./add-person-course.component.css']
})
export class AddPersonCourseComponent {
  person: Person = new Person;
  courses: Course[] = [];
  newPersonCourse: PersonCourse = new PersonCourse;
  currentCourses: PersonCourse[] = [];
  inactiveCourses: PersonCourse[] = [];

  courseTypes: string[] = (Object.values(CourseType) as Array<keyof typeof CourseType>)
    .filter(key => !isNaN(Number(CourseType[key])));

  status: string[] = (Object.values(Status) as Array<keyof typeof Status>)
    .filter(key => !isNaN(Number(Status[key])));

  constructor(private dialogRef: MatDialogRef<AddPersonCourseComponent>, private courseService: CourseService, private moduleService: ModuleService,
    @Inject(MAT_DIALOG_DATA)
    private data: {
      person: Person;
      currentCourses: PersonCourse[];
      inactiveCourses: PersonCourse[];
    }) {
    if (data.person) this.person = data.person;
    if (data.currentCourses) this.currentCourses = data.currentCourses;
    if (data.inactiveCourses) this.inactiveCourses = data.inactiveCourses;
  }

  ngOnInit() {
    this.getCourses();
  }

  getCourses() {
    // this.courseService.getCourses().subscribe(res => {
    //   this.modles = res;
    // })
  }

  closeDialog() {
    this.dialogRef.close();
  }

  compareDates(): boolean {
    let todaysDate = moment().utc();
    let startDate = moment(this.newPersonCourse.course.startDate);
    let startDateAfterToday = moment(startDate).isAfter(todaysDate, 'date');

    return startDateAfterToday
  }

  // ToDo: Omskriv
  onSubmit() {
    this.newPersonCourse.personId = this.person.personId;
    this.newPersonCourse.courseId = this.newPersonCourse.course.courseId;

    if (this.newPersonCourse.status != 2 || 3)
    {
      let startDateAfterToday = this.compareDates();
      if (startDateAfterToday) {
        // Sets 'NotStarted' if startDate is after today
        this.newPersonCourse.status = 0;
      } else {
        // Sets 'Started' if startDate is before or same as today's date
        this.newPersonCourse.status = 1
      }
    }
    

    // this.personModuleService.addPersonModules(this.newPersonModule).subscribe(res => {
    //   // Add the newPersonModule to the arrays injected into this component, this makes the PersonModules outside the popup update without having to refresh
    //   this.newPersonModule.personModuleId = res.personModuleId;

    //   if (res.status === 1) {
    //     this.currentCourses.push(this.newPersonModule);
    //   }
    //   else{
    //     this.inactiveCourses.push(this.newPersonModule);
    //   }
    //   this.closeDialog();
    // });
  }
}
