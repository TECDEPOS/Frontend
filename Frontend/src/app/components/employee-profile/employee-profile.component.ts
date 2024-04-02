import { Component, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, SimpleSnackBar } from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { MAT_SNACK_BAR_DATA, MatSnackBar} from '@angular/material/snack-bar';
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
import { AddPersonCourseComponent } from '../pop-ups/add-person-course/add-person-course.component';
import { CourseType } from 'src/app/Models/CourseType';
import { Status } from 'src/app/Models/Status';
import { Course } from 'src/app/Models/Course';
import { EditPersonmodulePopupComponent } from '../pop-ups/edit-personmodule-popup/edit-personmodule-popup.component';
import { AuthService } from 'src/app/Services/auth.service';
import { PersonCourse } from 'src/app/Models/PersonCourse';
import { Unsub } from 'src/app/classes/unsub';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { getLocaleMonthNames } from '@angular/common';
import { PersonCourseService } from 'src/app/Services/person-course.service';
import { ConfirmationPopupComponent } from '../pop-ups/confirmation-popup/confirmation-popup.component';
import { Observable } from 'rxjs';
import { SnackbarIndicatorComponent } from '../Misc/snackbar-indicator/snackbar-indicator.component';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})
export class EmployeeProfileComponent extends Unsub{
  moduleTypes = CourseType;
  popupOpened: boolean = false
  status = Status;
  editDisabled: boolean = true;
  saveDisabled: boolean = false;
  person: Person = new Person;
  backupValues: Person = new Person;
  educationalConsultants: User[] = [];
  operationCoordinators: User[] = [];
  departments: Department[] = [];
  locations: Location[] = [];
  shownFiles: File[] = [];
  currentPersonCourses: PersonCourse[] = [];
  inactiveModules: Course[] = [];
  CurrentHiringDate: Date = new Date();   

  statuses: string[] = (Object.values(Status) as Array<keyof typeof Status>)
  .filter(key => !isNaN(Number(Status[key])));

  constructor(
    private personService: PersonsService, 
    private userService: UserService,
    private departmentService: DepartmentsService, 
    private locationService: LocationsService,
    private aRoute: ActivatedRoute, 
    private dialog: MatDialog, 
    private fileService: FileService, 
    private authService: AuthService, 
    private snackBar: MatSnackBar,
    private personCourseService: PersonCourseService
    ) 
    {super(); }

  ngOnInit() {
    this.getPerson();
    this.getDepartments();
    this.getUsers();
    this.getLocations();
  }
  getLocations() {
    this.locationService.getLocations().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.locations = res;
    });
  }

  getUsers() {
    this.userService.getUsers().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.educationalConsultants = res.filter(x => x.userRole === 4);
      this.operationCoordinators = res.filter(x => x.userRole === 6);
    });
  }

  getDepartments() {
    this.departmentService.getDepartment().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.departments = res;
    });
  }

  getPerson() {
    let roleId = this.authService.getUserRoleId();
    console.log('Role id: ',roleId);
    
    this.aRoute.paramMap.pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
      let personId = Number(params.get('id'))
      this.personService.getPersonById(personId, roleId).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
        this.person = res;
        this.shownFiles = res.files;
        console.log(this.person);
        


        this.setPersonModules();
        this.setBackupValues(this.person);
      });
    });
  }

  setPersonModules() {
    this.person.personCourses = this.person.personCourses.sort((a, b) => a.status - b.status);

    if(this.person.personCourses.length !== 0){      
      this.currentPersonCourses = this.person.personCourses.filter(x => x.status === 1)
      .concat(this.person.personCourses.filter(x => x.status === 0))
      .concat(this.person.personCourses.filter(x => x.status === 3))
      .concat(this.person.personCourses.filter(x => x.status === 2))
      .concat(this.person.personCourses.filter(x => x.status === 4))
    }
  }

  onSubmit() {
  
  if(this.person.hiringDate !== this.CurrentHiringDate){
    this.saveDisabled = true
    this.popupOpened = true
    this.snackBar.openFromComponent(ChangeEnddateBarComponent, {
      
      data:{
        person: this.person,
        snackbar: this.snackBar
      }
    }).afterDismissed().subscribe(() => {
      this.personService.updatePerson(this.person).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
        this.person = res;
        this.editDisabled = true;
        this.setBackupValues(this.person);
        this.saveDisabled = false
        this.snackBar.openFromComponent(SnackbarIndicatorComponent, {
          data: {
            message: `Ændringer Gemt`,
            icon: 'done'
          }, panelClass: ['blue-snackbar'], duration: 3000
        });
      });
    })
  }
  else{
    this.personService.updatePerson(this.person).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.person = res;
      this.editDisabled = true;
      this.setBackupValues(this.person);
      this.popupOpened = false
      this.snackBar.openFromComponent(SnackbarIndicatorComponent, {
        data: {
          message: `Ændringer Gemt`
        }, panelClass: ['blue-snackbar'], duration: 3000
      });
    });
  }
  }

  enableEditMode() {
    this.editDisabled = false;
    this.CurrentHiringDate = this.person.hiringDate
  }

  cancelEditMode() {
    this.editDisabled = true;
    this.person = JSON.parse(JSON.stringify(this.backupValues));
    if(this.popupOpened){
      this.snackBar.dismiss()
    }
    
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


  openFileUploadPopUp() {
    this.dialog.open(FileuploadPopupComponent, {
      data: {
        personId: this.person.personId,
        personFiles: this.person.files,
      },
      disableClose: false,
    });
  }
  

  downloadFile(id: number, contentType: string, fileName: string) {
    this.fileService.downloadFile(id)
      .pipe(takeUntil(this.unsubscribe$))
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
    this.fileService.deleteFile(fileId).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.shownFiles.splice(i, 1)
    })
  }

  onSearchQueryInput(event: Event) {
    const searchQuery = (event.target as HTMLInputElement).value.toLocaleLowerCase();
    let tempList: File[] = []
    this.person.files.forEach(element => {
      if (element.fileName.toLocaleLowerCase().includes(searchQuery)) {
        tempList.push(element);
        console.log("Afdeling");
      }
      this.shownFiles = tempList;
    });
  }

  openAddPersonModulePopup() {
    this.dialog.open(AddPersonCourseComponent, {
      data: {
        person: this.person,
        currentPersonCourses: this.currentPersonCourses,
        closeAfter: true,
      },
      disableClose: false,
      height: '45%',
      width: '30%'
    }).afterClosed().subscribe(() => {
      this.organizedTable()
    })
    
  }

  openEditPersonModulePopup(personCourse: PersonCourse) {
    this.dialog.open(EditPersonmodulePopupComponent, {
      data: {
        personCourse: personCourse,
        currentPersonCourses: this.currentPersonCourses
      },
      disableClose: false,
      height: '50%',
      width: '25%'
    }).afterClosed().subscribe(() => {
      this.organizedTable()
    }) 
  }

  deletepersonCourse(personCourse: PersonCourse){
    this.confirmDelete(personCourse.course?.module.name).pipe(takeUntil(this.unsubscribe$)).subscribe(confirmed => {
      
      // Delete entity if user pressed yes in confirmation dialog.
      if (confirmed) {        
        this.personCourseService.deletePersonCourse(personCourse.personId, personCourse.courseId).subscribe(res => {
          this.currentPersonCourses.splice(this.currentPersonCourses.indexOf(personCourse), 1)
        })
      }
    });
    
  }

  organizedTable(){
    if(this.person.personCourses.length !== 0){      
      this.currentPersonCourses = this.currentPersonCourses.filter(x => x.status === 1)
      .concat(this.currentPersonCourses.filter(x => x.status === 0))
      .concat(this.currentPersonCourses.filter(x => x.status === 3))
      .concat(this.currentPersonCourses.filter(x => x.status === 2))
      .concat(this.currentPersonCourses.filter(x => x.status === 4))
    }
  } 



  changeStatus(personCourse: PersonCourse){
    personCourse.status = Number(personCourse.status)

    const personCourseCopy = JSON.parse(JSON.stringify(personCourse))
    personCourseCopy.course!.module = null!;
    this.personCourseService.updatePersonCourse(personCourseCopy).subscribe(res => {
    })
    this.organizedTable()
  }

  confirmDelete(entity: string|undefined): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      data: {
        message: `Sikker på at fjerne ${entity}?`
      }
    });

    return dialogRef.afterClosed();
  }

}

@Component({
  selector: 'app-change-enddate-bar',
  templateUrl: './change-enddate-bar.component.html',
  styleUrls: ['./change-enddate-bar.component.css'],
  standalone: true,
  imports: [MatSnackBarModule]
})

export class ChangeEnddateBarComponent {
  snackbar: any = MatSnackBar
  person: Person = new Person

  constructor(@Inject(MAT_SNACK_BAR_DATA) private data: {person:Person, snackbar: MatSnackBar}){
    if(data.snackbar) this.snackbar = data.snackbar
    if(data.person) this.person = data.person
  }

  pressedYes(){

     const temp = new Date(this.person.hiringDate)
     temp.setHours(new Date(this.person.hiringDate).getHours() + 1)
     temp.setFullYear(temp.getFullYear() + 4) 
     this.person.endDate = temp

    this.snackbar.dismiss()
  }

  pressedNo(){
    this.snackbar.dismiss()
  }


}