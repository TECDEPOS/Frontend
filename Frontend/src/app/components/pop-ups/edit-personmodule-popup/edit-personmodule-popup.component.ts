import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Module } from 'src/app/Models/Module';
import { CourseType } from 'src/app/Models/CourseType';
import { Course } from 'src/app/Models/Course';
import { Status } from 'src/app/Models/status';
import { ModuleService } from 'src/app/Services/module.service';
import { CourseService } from 'src/app/Services/course.service';

@Component({
  selector: 'app-edit-personmodule-popup',
  templateUrl: './edit-personmodule-popup.component.html',
  styleUrls: ['./edit-personmodule-popup.component.css']
})
export class EditPersonmodulePopupComponent {

  tempModule: Course = new Course;
  personModule: Course = new Course;
  currentModules: Course[] = [];
  inactiveModules: Course[] = [];
  modules: Module[] = [];
  moduleTypes: string[] = (Object.values(CourseType) as Array<keyof typeof CourseType>)
    .filter(key => !isNaN(Number(CourseType[key])));
  statuses: string[] = (Object.values(Status) as Array<keyof typeof Status>)
    .filter(key => !isNaN(Number(Status[key])));

  constructor(private dialogRef: MatDialogRef<EditPersonmodulePopupComponent>, private moduleService: ModuleService, private personModuleService: CourseService,
    @Inject(MAT_DIALOG_DATA) private data: { personModule: Course; currentModules: Course[]; inactiveModules: Course[]; })
    { 
      if (data.personModule) this.personModule = data.personModule;
      if (data.currentModules) this.currentModules = data.currentModules;
      if (data.inactiveModules) this.inactiveModules = data.inactiveModules;

     }


  ngOnInit(){
    console.log(this.personModule);
    this.tempModule = JSON.parse(JSON.stringify(this.personModule));
    this.getModules();
  }

  getModules() {
    this.moduleService.getModule().subscribe(res => {
      this.modules = res;
      console.log(this.modules);
    })
  }

  // ToDo: Omskriv
  onSubmit(){
    this.personModuleService.updateCourse(this.tempModule).subscribe(res => {
      console.log('Injected: ', this.personModule);
      console.log('Updated: ',this.tempModule);

      // If old and edited personModule is "Startet" then replace the old with edited in injected currentModules variable to update immediately
      if(this.personModule)      


      // if (this.personModule.status === 1 && this.tempModule.status === 1) {
      //   this.currentModules.splice(this.currentModules.indexOf(this.personModule), 1, this.tempModule);
      // }
      // // If old and edited personModule is -NOT- "Startet" then replace the old with edited in injected inactiveModules variable to update immediately
      // else if (this.personModule.status !== 1 && this.tempModule.status !== 1) {
      //   this.inactiveModules.splice(this.currentModules.indexOf(this.personModule), 1, this.tempModule);
      // }
      // // If status has changed FROM "Startet", Remove old personModule from currentModules and add the updated one to inactiveModules
      // else if (this.personModule.status === 1 && this.tempModule.status !== 1) {
      //   this.currentModules.splice(this.currentModules.indexOf(this.personModule), 1);
      //   this.inactiveModules.push(this.tempModule);
      // }
      // // If status has changed TO "Startet", Remove old personModule from inactiveModules and add the updated one to currentModules
      // else if (this.personModule.status !== 1 && this.tempModule.status === 1) {
      //   this.inactiveModules.splice(this.inactiveModules.indexOf(this.personModule), 1);
      //   this.currentModules.push(this.tempModule);
      // }
      this.closeDialog();
    })
  }

  // ToDo: Omskriv
  deletePersonModule(){
    // this.personModuleService.deletePersonModule(this.personModule.personModuleId).subscribe(res => {
      // if (this.personModule.status === 1) {
      //   this.currentModules.splice(this.currentModules.indexOf(this.personModule), 1)
      // }
      // else{
      //   this.inactiveModules.splice(this.inactiveModules.indexOf(this.personModule), 1);
      // }
      // this.closeDialog();
    // });
  }

  closeDialog(){
    this.dialogRef.close();
  }

  compareObjects(o1: any, o2: any): boolean {
    if (o2 == null) {
      return false;
    }

    if (typeof (o2 == Module)) {
      return o1.name === o2.name && o1.moduleId === o2.moduleId;
    }
    else{
      return false;
    }
  }
}
