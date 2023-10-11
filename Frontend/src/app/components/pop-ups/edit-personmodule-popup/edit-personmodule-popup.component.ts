import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Module } from 'src/app/Models/Module';
import { ModuleType } from 'src/app/Models/ModuleType';
import { PersonModule } from 'src/app/Models/PersonModule';
import { Status } from 'src/app/Models/status';
import { ModuleService } from 'src/app/Services/module.service';
import { PersonModuleService } from 'src/app/Services/person-module.service';

@Component({
  selector: 'app-edit-personmodule-popup',
  templateUrl: './edit-personmodule-popup.component.html',
  styleUrls: ['./edit-personmodule-popup.component.css']
})
export class EditPersonmodulePopupComponent {

  tempModule: PersonModule = new PersonModule;
  personModule: PersonModule = new PersonModule;
  personModules: PersonModule[] = [];
  modules: Module[] = [];
  moduleTypes: string[] = (Object.values(ModuleType) as Array<keyof typeof ModuleType>)
    .filter(key => !isNaN(Number(ModuleType[key])));
  statuses: string[] = (Object.values(Status) as Array<keyof typeof Status>)
    .filter(key => !isNaN(Number(Status[key])));

  constructor(private dialogRef: MatDialogRef<EditPersonmodulePopupComponent>, private moduleService: ModuleService, private personModuleService: PersonModuleService,
    @Inject(MAT_DIALOG_DATA) private data: { personModule: PersonModule; personModules: PersonModule[]; }) { if (data.personModule) this.personModule = data.personModule }


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

  //TODO - Jimmy: show the updated changes on employee-profile page after saving
  onSubmit(){
    this.personModuleService.updatepersonModules(this.tempModule).subscribe(res => {
      console.log(res);
      this.personModule = this.tempModule;
      
    })
  }

  //TODO - Jimmy: Remove the deleted PersonModule from the list on the employee-profile page
  deletePersonModule(){
    this.personModuleService.deletePersonModule(this.personModule.personModuleId).subscribe(res => {
      console.log(res);
      
    });
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
