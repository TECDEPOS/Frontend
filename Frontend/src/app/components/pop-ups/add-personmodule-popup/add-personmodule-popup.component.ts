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
  moduleTypes: string[] = (Object.values(ModuleType) as Array<keyof typeof ModuleType>)
    .filter(key => !isNaN(Number(ModuleType[key])));
  constructor(private dialogRef: MatDialogRef<AddPersonmodulePopupComponent>, private personModuleService: PersonModuleService, private moduleService: ModuleService,
    @Inject(MAT_DIALOG_DATA)
    private data: {
      person: Person;
    }) {
    if (data.person) this.person = data.person;
  }

  ngOnInit(){
    this.getModules();
    console.log(this.person);
    
    console.log(this.moduleTypes);
    
  }

  getModules() {
    this.moduleService.getModule().subscribe(res => {
      this.modules = res;
      console.log(this.modules);
      
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
    this.newPersonModule.module = null!
    this.newPersonModule.person = null!;
    
    let startDateAfterToday = this.compareDates();
    if (startDateAfterToday) {
      // Sets 'NotStarted' if startDate is after today
      this.newPersonModule.status = 0;
    } else {
      // Sets 'Started' if startDate is before or same as today's date
      this.newPersonModule.status = 1
    }
    
    this.personModuleService.addPersonModules(this.newPersonModule).subscribe(res => {
      console.log(res);
      this.closeDialog();
    });
  }
}
