import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { CourseType } from 'src/app/Models/CourseType';
import { Person } from 'src/app/Models/Person';
import { Course } from 'src/app/Models/Course';
import { CourseService } from 'src/app/Services/course.service';
import { PersonCourse } from 'src/app/Models/PersonCourse';
import { Status } from 'src/app/Models/Status';
import { PersonCourseService } from 'src/app/Services/person-course.service';


@Component({
  selector: 'app-add-person-course',
  templateUrl: './add-person-course.component.html',
  styleUrls: ['./add-person-course.component.css']
})
export class AddPersonCourseComponent {
  showStatus: boolean = false;
  person: Person = new Person;
  newPersonCourse: PersonCourse = new PersonCourse;
  courses: Course[] = [];
  currentCourses: PersonCourse[] = [];
  inactiveCourses: PersonCourse[] = [];

  courseTypes: string[] = (Object.values(CourseType) as Array<keyof typeof CourseType>)
    .filter(key => !isNaN(Number(CourseType[key])));

  status: string[] = (Object.values(Status) as Array<keyof typeof Status>)
    .filter(key => !isNaN(Number(Status[key])));

  constructor(private dialogRef: MatDialogRef<AddPersonCourseComponent>, private courseService: CourseService, private personCourseService: PersonCourseService,
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
    this.courseService.getAllCourses().subscribe(res => {
      this.courses = res;
      
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

  onCourseChange(course: Course){
    let endDateBeforeToday = this.compareEndDates();
        
    if (endDateBeforeToday)
    {
      this.showStatus = false;
    }
    else
    {
      this.showStatus = true;
    }
  }

  // ToDo: Omskriv
  onSubmit() {
    this.newPersonCourse.personId = this.person.personId;
    this.newPersonCourse.courseId = this.newPersonCourse.course!.courseId;
    this.newPersonCourse.course = null!;
    this.newPersonCourse.person = null!;

    if (this.newPersonCourse.status != 2 || 3)
    {
      let startDateAfterToday = this.compareStartDates();
      if (startDateAfterToday) {
        // Sets 'NotStarted' if startDate is after today
        this.newPersonCourse.status = 0;
      } else {
        // Sets 'Started' if startDate is before or same as today's date
        this.newPersonCourse.status = 1
      }
    }    

    this.personCourseService.addPersonCourse(this.newPersonCourse).subscribe(res => {
      // Add the newPersonModule to the arrays injected into this component, this makes the PersonModules outside the popup update without having to refresh      
      if (res.status === 1) {
        this.currentCourses.push(this.newPersonCourse);
      }
      else{
        this.inactiveCourses.push(this.newPersonCourse);
      }
      this.closeDialog();
    });
  }
}
