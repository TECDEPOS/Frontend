import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { Module } from 'src/app/Models/Module';
import { ModuleType } from 'src/app/Models/ModuleType';
import { Person } from 'src/app/Models/Person';
import { PersonModule } from 'src/app/Models/PersonModule';
import { ModuleService } from 'src/app/Services/module.service';
import { PersonModuleService } from 'src/app/Services/person-module.service';

@Component({
  selector: 'app-add-personmodule-popup',
  templateUrl: './add-personmodule-popup.component.html',
  styleUrls: ['./add-personmodule-popup.component.css']
})
export class AddPersonmodulePopupComponent {

  person: Person = new Person;
  modules: Module[] = [];
  newPersonModule: PersonModule = new PersonModule;
  currentModules: PersonModule[] = [];
  inactiveModules: PersonModule[] = [];
  moduleTypes: string[] = (Object.values(ModuleType) as Array<keyof typeof ModuleType>)
    .filter(key => !isNaN(Number(ModuleType[key])));
  constructor(private dialogRef: MatDialogRef<AddPersonmodulePopupComponent>, private personModuleService: PersonModuleService, private moduleService: ModuleService,
    @Inject(MAT_DIALOG_DATA)
    private data: {
      person: Person;
      currentModules: PersonModule[];
      inactiveModules: PersonModule[];
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

  onSubmit(){
    this.newPersonModule.personId = this.person.personId;
    this.newPersonModule.moduleId = this.newPersonModule.module.moduleId
    
    let startDateAfterToday = this.compareDates();
    if (startDateAfterToday) {
      // Sets 'NotStarted' if startDate is after today
      this.newPersonModule.status = 0;
    } else {
      // Sets 'Started' if startDate is before or same as today's date
      this.newPersonModule.status = 1
    }
    
    this.personModuleService.addPersonModules(this.newPersonModule).subscribe(res => {
      // Add the newPersonModule to the arrays injected into this component, this makes the PersonModules outside the popup update without having to refresh
      this.newPersonModule.personModuleId = res.personModuleId;
      
      if (res.status === 1) {
        this.currentModules.push(this.newPersonModule);
      }
      else{
        this.inactiveModules.push(this.newPersonModule);
      }
      this.closeDialog();
    });
  }
}
