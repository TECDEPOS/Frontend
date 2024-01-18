import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { Module } from 'src/app/Models/Module';
import { CourseType } from 'src/app/Models/CourseType';
import { Person } from 'src/app/Models/Person';
import { Course } from 'src/app/Models/Course';
import { ModuleService } from 'src/app/Services/module.service';
import { CourseService } from 'src/app/Services/course.service';

@Component({
  selector: 'app-add-personmodule-popup',
  templateUrl: './add-personmodule-popup.component.html',
  styleUrls: ['./add-personmodule-popup.component.css']
})
export class AddPersonmodulePopupComponent {

  person: Person = new Person;
  modules: Module[] = [];
  newPersonModule: Course = new Course;
  currentModules: Course[] = [];
  inactiveModules: Course[] = [];
  moduleTypes: string[] = (Object.values(CourseType) as Array<keyof typeof CourseType>)
    .filter(key => !isNaN(Number(CourseType[key])));
  constructor(private dialogRef: MatDialogRef<AddPersonmodulePopupComponent>, private personModuleService: CourseService, private moduleService: ModuleService,
    @Inject(MAT_DIALOG_DATA)
    private data: {
      person: Person;
      currentModules: Course[];
      inactiveModules: Course[];
    }) {
    if (data.person) this.person = data.person;
    if (data.currentModules) this.currentModules = data.currentModules;
    if (data.inactiveModules) this.inactiveModules = data.inactiveModules;
  }

  ngOnInit(){
    this.getModules();    
  }

  getModules() {
    this.moduleService.getModule().subscribe(res => {
      this.modules = res;
    })
  }

  closeDialog() {
    this.dialogRef.close();
  }

  compareDates(): boolean{
    let todaysDate = moment().utc();
    let startDate = moment(this.newPersonModule.startDate);
    let startDateAfterToday = moment(startDate).isAfter(todaysDate, 'date');
    
    return startDateAfterToday
  }

  // ToDo: Omskriv
  onSubmit(){
    this.newPersonModule.courseId = this.person.personId;
    this.newPersonModule.moduleId = this.newPersonModule.module.moduleId
    
    // let startDateAfterToday = this.compareDates();
    // if (startDateAfterToday) {
    //   // Sets 'NotStarted' if startDate is after today
    //   this.newPersonModule.status = 0;
    // } else {
    //   // Sets 'Started' if startDate is before or same as today's date
    //   this.newPersonModule.status = 1
    // }
    
    // this.personModuleService.addPersonModules(this.newPersonModule).subscribe(res => {
    //   // Add the newPersonModule to the arrays injected into this component, this makes the PersonModules outside the popup update without having to refresh
    //   this.newPersonModule.personModuleId = res.personModuleId;
      
    //   if (res.status === 1) {
    //     this.currentModules.push(this.newPersonModule);
    //   }
    //   else{
    //     this.inactiveModules.push(this.newPersonModule);
    //   }
    //   this.closeDialog();
    // });
  }
}
