import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { Department } from 'src/app/Models/Department';
import { Location } from 'src/app/Models/Location';
import { Person } from 'src/app/Models/Person';
import { User } from 'src/app/Models/User';
import { DepartmentsService } from 'src/app/Services/departments.service';
import { LocationsService } from 'src/app/Services/locations.service';
import { PersonsService } from 'src/app/Services/persons.service';
import { UserService } from 'src/app/Services/user.service';
import { FileuploadPopupComponent } from '../pop-ups/fileupload-popup/fileupload-popup.component';
import { FileService } from 'src/app/Services/file.service';
import { File } from 'src/app/Models/File';
import { AddPersonmodulePopupComponent } from '../pop-ups/add-personmodule-popup/add-personmodule-popup.component';
import { ModuleType } from 'src/app/Models/ModuleType';
import { Status } from 'src/app/Models/status';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})
export class EmployeeProfileComponent {

  moduleTypes = ModuleType;
  status = Status;
  editDisabled: boolean = true;
  person: Person = new Person;
  backupValues: Person = new Person;
  educationalConsultants: User[] = [];
  operationCoordinators: User[] = [];
  departments: Department[] = [];
  locations: Location[] = [];
  shownFiles: File[] = [];
  constructor(private personService: PersonsService, private userService: UserService,
    private departmentService: DepartmentsService, private locationService: LocationsService,
    private aRoute: ActivatedRoute, private dialog: MatDialog, private fileService: FileService) { }

  ngOnInit(){
    this.getPerson();
    this.getDepartments();
    this.getUsers();
    this.getLocations();
  }
  getLocations() {
    this.locationService.getLocations().subscribe(res => {
      this.locations = res;
    });
  }

  getUsers() {
    this.userService.getUsers().subscribe(res => {
      this.educationalConsultants = res.filter(x => x.userRole === 1 || x.userRole === 4);
      this.operationCoordinators = res.filter(x => x.userRole === 3 || x.userRole === 6);
    });
  }
  getDepartments() {
    this.departmentService.getDepartment().subscribe(res => {
      this.departments = res;
    });
  }
  getPerson() {
    this.aRoute.paramMap.subscribe(params => {
      let id = Number(params.get('id'))
      this.personService.getPersonById(id).subscribe(res => {
        this.person = res;
        this.shownFiles = res.files;
        console.log(this.person.personModules);
        
        this.setBackupValues(this.person);
      });
    });
  }

  onSubmit() {
    this.personService.updatePerson(this.person).subscribe(res => {
      this.person = res;
      this.editDisabled = true;
      this.setBackupValues(this.person);
    });
  }

  enableEditMode() {
    this.editDisabled = false;
  }

  cancelEditMode() {
    this.editDisabled = true;
    this.person = JSON.parse(JSON.stringify(this.backupValues));
  }

  setBackupValues(values: Person) {
    //Sets backup values used if users press Cancel during edit mode.
    this.backupValues = JSON.parse(JSON.stringify(values));
  }

  //Used for select dropdowns, without this no value will be shown on load even if a value has been set
  compareObjects(o1: any, o2: any): boolean {
    if (o2 == null) {
      return false;
    }

    if (typeof (o2 == Location)) {
      return o1.name === o2.name && o1.locationId === o2.locationId;
    }
    else if (typeof (o2 == Department)) {
      return o1.name === o2.name && o1.departmentId === o2.departmentId;
    }
    else if (typeof (o2 == User)) {
      return o1.name === o2.name && o1.userId === o2.userId;
    }
    else {
      return false;
    }
  }

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      return;
    }

    this.person.files = this.person.files.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'fileName':
          return this.compare(a.fileName, b.fileName) * (sort.direction == 'asc' ? 1 : -1);
        case 'fileCategory':
          return this.compare(a.fileTag?.tagName, b.fileTag?.tagName) * (sort.direction == 'asc' ? 1 : -1);
        case 'uploadDate':
          return this.compare(a.uploadDate, b.uploadDate) * (sort.direction == 'asc' ? 1 : -1);
        case 'fileFormat':
          return this.compare(a.fileFormat, b.fileFormat) * (sort.direction == 'asc' ? 1 : -1);
        default:
          return 0;
      }
    });
  }

  compare(itemA: any, itemB: any): number {
    let retVal: number = 0;
      if (itemA && itemB) {
        if (itemA.toLocaleLowerCase() > itemB.toLocaleLowerCase()) retVal = 1;
        else if (itemA.toLocaleLowerCase() < itemB.toLocaleLowerCase()) retVal = -1;
      }
      else if (itemA) retVal = 1;
      else if (itemB) retVal = -1;
      return retVal;
  }


  openFileUploadPopUp(){
    this.dialog.open(FileuploadPopupComponent,{
      data: {
        personId: this.person.personId,
        personFiles: this.person.files,
      },
      disableClose: false,
    });
  }

  downloadFile(id: number, contentType: string, fileName: string) {
    this.fileService.downloadFile(id)
      .subscribe((result: Blob) => {
        console.log(result);
        const blob = new Blob([result], { type: contentType });
        const url = window.URL.createObjectURL(blob);

        // Create a temporary anchor element to trigger the download
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName; // Set the desired file name
        a.style.display = 'none';
        document.body.appendChild(a);

        // Click the anchor element to trigger the download
        a.click();

        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        console.log("Success");
      });
  }

  deleteFile(fileId: number, i: number) {
    this.fileService.deleteFile(fileId).subscribe(() => { 
      this.shownFiles.splice(i, 1)
    })
  }

  onSearchQueryInput(event: Event){
    const searchQuery = (event.target as HTMLInputElement).value.toLocaleLowerCase();
    let tempList: File[] = []
    this.person.files.forEach(element => {
      if (element.fileName.toLocaleLowerCase().includes(searchQuery)){
          tempList.push(element);
          console.log("Afdeling");      
      }
      this.shownFiles = tempList;
    });    
  }

  openAddPersonModulePopup(){
    this.dialog.open(AddPersonmodulePopupComponent,{
      data: {
        person: this.person,
      },
      disableClose: false,
      height: '40%',
      width: '25%'
    });
    }
}
