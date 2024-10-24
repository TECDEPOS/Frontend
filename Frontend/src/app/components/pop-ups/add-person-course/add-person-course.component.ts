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
  closeAfter: boolean = false;
  moduleSelected: boolean = false;
  modulePassed: boolean = false;
  module: Module = new Module;
  person: Person = new Person;
  newPersonCourse: PersonCourse = new PersonCourse;
  modules: Module[] = [];
  courses: Course[] = [];
  currentCourses: PersonCourse[] = [];

  statuses: string[] = (Object.values(Status) as Array<keyof typeof Status>)
    .filter(key => !isNaN(Number(Status[key])));

  // Constructor for AddPersonCourseComponent, initializes services and injects data
  constructor(
    private dialogRef: MatDialogRef<AddPersonCourseComponent>,
    private courseService: CourseService,
    private personCourseService: PersonCourseService,
    private moduleService: ModuleService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA)
    private data: {
      person: Person;
      currentPersonCourses: PersonCourse[];
      closeAfter: boolean;
    }) {
    // Initialize person, currentCourses, and closeAfter based on injected data
    if (data.person) this.person = data.person;
    if (data.currentPersonCourses) this.currentCourses = data.currentPersonCourses;
    if (data.closeAfter) this.closeAfter = data.closeAfter;
  }

  // Called on component initialization
  ngOnInit() {
    this.getModules();
  }

  // Retrieves the list of modules
  getModules() {
    this.moduleService.getModules().subscribe(res => {
      this.modules = res;
    })
  }

  // Fetches courses by moduleId and userId
  getCourses(id: number) {
    console.log(this.person);
    console.log(this.person.personId);
    this.courseService.getCoursesByModuleIdAndUserId(id, this.person.personId).subscribe(res => {
      this.courses = res;
      console.log(res);
      this.filterCoursesPassedModules();
    })
  }

  // Filters courses based on passed modules
  filterCoursesPassedModules() {
    this.modulePassed = this.currentCourses.some(pc => pc.course?.moduleId === this.module.moduleId && pc.status === 3);

    if (this.modulePassed) {
      this.courses = [];
    }
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

  // Called when a module is selected
  onModuleChange(module: Module) {
    console.log(module);

    this.getCourses(module.moduleId);
    this.moduleSelected = true;
    this.module = module;

    // Clear selected course on module change
    this.newPersonCourse.course = null;

    this.cdr.detectChanges();
  }

  // Called when a course is selected
  onCourseChange(course: Course) {
    this.newPersonCourse.course = course;
    console.log(this.newPersonCourse);

    let endDateBeforeToday = this.compareEndDates();

    if (endDateBeforeToday) {
      let startDateAfterToday = this.compareStartDates();
      this.newPersonCourse.status = startDateAfterToday ? 0 : 1;
    } else {
      this.newPersonCourse.status = 3;
    }

    this.cdr.detectChanges();
  }

  // Comparison function for dropdown selection
  compareFn(optionValue: any, selectionValue: any): boolean {
    return optionValue === selectionValue;
  }

  // Submits the new person course data
  onSubmit() {
    const newPersonCourseCopy: PersonCourse = { ...this.newPersonCourse }
    newPersonCourseCopy.course!.module = this.module;

    this.newPersonCourse.personId = this.person.personId;
    this.newPersonCourse.courseId = this.newPersonCourse.course!.courseId;
    this.newPersonCourse.course = null!;
    this.newPersonCourse.person = null!;

    this.personCourseService.addPersonCourse(this.newPersonCourse).subscribe(res => {
      res.course = newPersonCourseCopy.course;
      this.currentCourses.push(res);
      if (this.closeAfter) {
        this.closeDialog();
      }
      this.courses.splice(this.courses.findIndex(x => x.courseId == this.newPersonCourse.courseId), 1);
    });
  }

  // Returns the course type name based on the CourseType enum
  getCourseTypeName(courseType: CourseType): string {
    return CourseType[courseType];
  }
}
