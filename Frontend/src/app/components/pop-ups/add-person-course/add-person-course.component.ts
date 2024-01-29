import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { CourseType } from 'src/app/Models/CourseType';
import { Person } from 'src/app/Models/Person';
import { Course } from 'src/app/Models/Course';
import { CourseService } from 'src/app/Services/course.service';
import { PersonCourse } from 'src/app/Models/PersonCourse';
import { Status } from 'src/app/Models/Status';
import { PersonCourseService } from 'src/app/Services/person-course.service';
import { Module } from 'src/app/Models/Module';
import { ModuleService } from 'src/app/Services/module.service';


@Component({
  selector: 'app-add-person-course',
  templateUrl: './add-person-course.component.html',
  styleUrls: ['./add-person-course.component.css']
})
export class AddPersonCourseComponent {
  showStatus: number = 0;
  moduleSelected: boolean = false;
  module: Module = new Module;
  person: Person = new Person;
  newPersonCourse: PersonCourse = new PersonCourse;
  modules: Module[] = [];
  courses: Course[] = [];
  currentCourses: PersonCourse[] = [];
  inactiveCourses: PersonCourse[] = [];

  courseTypes: string[] = (Object.values(CourseType) as Array<keyof typeof CourseType>)
    .filter(key => !isNaN(Number(CourseType[key])));

  status: string[] = (Object.values(Status) as Array<keyof typeof Status>)
    .filter(key => !isNaN(Number(Status[key])));

  constructor(
    private dialogRef: MatDialogRef<AddPersonCourseComponent>,
    private courseService: CourseService,
    private personCourseService: PersonCourseService,
    private moduleService: ModuleService,
    private cdr: ChangeDetectorRef,
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
    this.getModules();
  }

  getCourses(id: number) {
    this.courseService.getCoursesByModuleId(id,this.person.personId).subscribe(res => {
      this.courses = res;
    })
  }

  getModules() {
    this.moduleService.getModule().subscribe(res => {
      this.modules = res;
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

  onModuleChange(module: Module) {
    this.getCourses(module.moduleId);
    this.moduleSelected = true;
    
    this.cdr.detectChanges();
  }

  onCourseChange(course: Course) {
    this.newPersonCourse.course = course;
    console.log(this.newPersonCourse.course);
    
    let endDateBeforeToday = this.compareEndDates();
  
    if (endDateBeforeToday) {
      let startDateAfterToday = this.compareStartDates();
      if (startDateAfterToday) {
        this.showStatus = 0;
      } else {
        this.showStatus = 1;
      }
    }
    else {
      this.showStatus = 3;
    }
  
    this.cdr.detectChanges();
  }


// Add this method in your component class
compareFn(optionValue: any, selectionValue: any): boolean {
  return optionValue === selectionValue;
}

onSubmit() {
  this.newPersonCourse.personId = this.person.personId;
  this.newPersonCourse.courseId = this.newPersonCourse.course!.courseId;
  this.newPersonCourse.course = null!;
  this.newPersonCourse.person = null!;

  if (this.newPersonCourse.status != 2 || 3) {
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
    else {
      this.inactiveCourses.push(this.newPersonCourse);
    }
    this.closeDialog();
  });
}

getCourseTypeName(courseType: CourseType): string {
  return CourseType[courseType];
}
}
