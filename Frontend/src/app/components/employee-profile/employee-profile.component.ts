import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, SimpleSnackBar } from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { MAT_SNACK_BAR_DATA, MatSnackBar } from '@angular/material/snack-bar';
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
import { ErrorPopupComponent } from '../pop-ups/error-popup/error-popup.component';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})
export class EmployeeProfileComponent extends Unsub {
  moduleTypes = CourseType;
  popupOpened: boolean = false
  status = Status;
  editDisabled: boolean = true;
  saveDisabled: boolean = false;
  person: Person = new Person;
  backupValues: Person = new Person;
  educationalConsultants: User[] = [];
  operationCoordinators: User[] = [];
  educationLeaders: User[] = [];
  departments: Department[] = [];
  locations: Location[] = [];
  shownFiles: File[] = [];
  currentPersonCourses: PersonCourse[] = [];
  currentPersonCoursesCopy: PersonCourse[] = [];
  inactiveModules: Course[] = [];
  CurrentHiringDate: Date = new Date();
  previousStatuses: Record<number, number> = {};

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
  ) { super(); }

  ngOnInit() {
    this.getPerson();
    this.getDepartments();
    this.getUsers();
    this.getLocations();
  }

  // Method to get all locations from the service
  getLocations() {
    this.locationService.getLocations().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.locations = res;
    });
  }

  // Method to get all users and filter them by roles
  getUsers() {
    this.userService.getUsers().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.educationalConsultants = res.filter(x => x.userRole === 4);
      this.operationCoordinators = res.filter(x => x.userRole === 6);
      this.educationLeaders = res.filter(x => x.userRole === 2);
    });
  }

  // Method to get all departments from the service
  getDepartments() {
    this.departmentService.getDepartment().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.departments = res;
    });
  }

  // Method to get a person by ID and set person details
  getPerson() {
    let roleId = this.authService.getUserRoleId();
    console.log('Role id: ', roleId);

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

  // Method to organize person modules by status
  setPersonModules() {
    this.person.personCourses = this.person.personCourses.sort((a, b) => a.status - b.status);

    if (this.person.personCourses.length !== 0) {
      this.currentPersonCourses = this.person.personCourses.filter(x => x.status === 1)
        .concat(this.person.personCourses.filter(x => x.status === 0))
        .concat(this.person.personCourses.filter(x => x.status === 3))
        .concat(this.person.personCourses.filter(x => x.status === 2))
        .concat(this.person.personCourses.filter(x => x.status === 4))
      this.storeStatus();
    }
  }

  // Method to submit person details and handle changes
  onSubmit() {
    // Check if the hiring date has changed
    if (this.person.hiringDate !== this.CurrentHiringDate) {
      this.saveDisabled = true;
      this.popupOpened = true;

      // Open a snackbar to confirm the change in end date
      this.snackBar.openFromComponent(ChangeEnddateBarComponent, {
        data: {
          person: this.person,
          snackbar: this.snackBar
        }
      }).afterDismissed().subscribe(() => {

        // Update the person details after snackbar is dismissed
        this.personService.updatePerson(this.person).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
          this.person = res;
          this.editDisabled = true;
          this.setBackupValues(this.person);
          this.saveDisabled = false;

          // Open a snackbar indicating changes were saved
          this.snackBar.openFromComponent(SnackbarIndicatorComponent, {
            data: {
              message: `Ændringer Gemt`,
              icon: 'done'
            }, panelClass: ['blue-snackbar'], duration: 3000
          });
        });
      })
    } else {

      // If no hiring date changes, directly update the person details
      this.personService.updatePerson(this.person).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
        this.person = res;
        this.editDisabled = true;
        this.setBackupValues(this.person);
        this.popupOpened = false;

        // Open a snackbar indicating changes were saved
        this.snackBar.openFromComponent(SnackbarIndicatorComponent, {
          data: {
            message: `Ændringer Gemt`
          }, panelClass: ['blue-snackbar'], duration: 3000
        });
      });
    }
  }


  // Method to enable edit mode
  enableEditMode() {
    this.editDisabled = false;
    this.CurrentHiringDate = this.person.hiringDate;
  }

  // Method to cancel edit mode and restore backup values
  cancelEditMode() {
    this.editDisabled = true;
    this.person = JSON.parse(JSON.stringify(this.backupValues));
    if (this.popupOpened) {
      this.snackBar.dismiss();
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

  // Method to sort person files based on various properties
  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      return;
    }

    this.person.files = this.person.files.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'fileName':
          return this.compare(a.fileName, b.fileName) * (isAsc ? 1 : -1);
        case 'fileCategory':
          return this.compare(a.fileTag?.tagName, b.fileTag?.tagName) * (isAsc ? 1 : -1);
        case 'uploadDate':
          return this.compare(a.uploadDate, b.uploadDate) * (isAsc ? 1 : -1);
        case 'fileFormat':
          return this.compare(a.fileFormat, b.fileFormat) * (isAsc ? 1 : -1);
        default:
          return 0;
      }
    });
  }

  // Method to compare two items for sorting
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

  // Method to open the file upload popup for a person
  openFileUploadPopUp() {
    this.dialog.open(FileuploadPopupComponent, {
      data: {
        personId: this.person.personId,
        personFiles: this.person.files,
      },
      disableClose: false,
    });
  }

  // Method to download a file by ID
  downloadFile(id: number, contentType: string, fileName: string) {
    this.fileService.downloadFile(id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result: Blob) => {
        const blob = new Blob([result], { type: contentType });
        const url = window.URL.createObjectURL(blob);

        // Create and trigger download using a temporary anchor element
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();

        // Clean up temporary elements
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      });
  }

  // Method to delete a file by ID and remove it from the list
  deleteFile(fileId: number, i: number) {
    this.fileService.deleteFile(fileId).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.shownFiles.splice(i, 1);
    });
  }

  // Method to filter and search files based on input query
  onSearchQueryInput(event: Event) {
    const searchQuery = (event.target as HTMLInputElement).value.toLocaleLowerCase();
    let tempList: File[] = [];
    this.person.files.forEach(element => {
      if (element.fileName.toLocaleLowerCase().includes(searchQuery)) {
        tempList.push(element);
      }
      this.shownFiles = tempList;
    });
  }

  // Method to open the popup to add a person module
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
      this.organizedTable();
    });
  }

  // Method to open the popup to edit a person module
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
      this.organizedTable();
    });
  }

  // Method to delete a person course after confirmation
  deletepersonCourse(personCourse: PersonCourse) {
    this.confirmDelete(personCourse.course?.module.name).pipe(takeUntil(this.unsubscribe$)).subscribe(confirmed => {
      if (confirmed) {
        this.personCourseService.deletePersonCourse(personCourse.personId, personCourse.courseId!).subscribe(() => {
          this.currentPersonCourses.splice(this.currentPersonCourses.indexOf(personCourse), 1);
        });
      }
    });
  }

  // Method to organize and update the table of person courses
  organizedTable() {
    if (this.person.personCourses.length !== 0) {
      this.currentPersonCourses = this.currentPersonCourses.filter(x => x.status === 1)
        .concat(this.currentPersonCourses.filter(x => x.status === 0))
        .concat(this.currentPersonCourses.filter(x => x.status === 3))
        .concat(this.currentPersonCourses.filter(x => x.status === 2))
        .concat(this.currentPersonCourses.filter(x => x.status === 4));
      this.storeStatus();
    }
  }

  // Method to update a person course
  updatePersonCourse(personCourse: PersonCourse) {
    const personCourseCopy = JSON.parse(JSON.stringify(personCourse));
    personCourseCopy.course!.module = null!;
    this.personCourseService.updatePersonCourse(personCourseCopy).subscribe(() => {
      this.organizedTable();
    });
  }

  // Method to store the status of each person course
  storeStatus() {
    this.previousStatuses = {};
    for (let index = 0; index < this.currentPersonCourses.length; index++) {
      this.previousStatuses[index] = this.currentPersonCourses[index].status;
    }
  }

  // Method to track items by course ID
  trackById(item: any): number {
    return item.courseId;
  }

  // Method to change the status of a person course
  changeStatus(personCourse: PersonCourse, index: number) {
    personCourse.status = Number(personCourse.status);
    const alreadyPassed = this.checkPassedModules(personCourse);

    if (personCourse.status === 3 && alreadyPassed) {
      setTimeout(() => {
        personCourse.status = this.previousStatuses[index];
      });

      this.dialog.open(ErrorPopupComponent, {
        data: {
          message: `${this.person.name} har allerede bestået modulet: ${personCourse.course?.module.name}`
        }
      });
    } else {
      this.previousStatuses[index] = personCourse.status;
      this.updatePersonCourse(personCourse);
    }
  }

  // Method to check if the person has already passed the module
  checkPassedModules(personCourse: PersonCourse): boolean {
    let alreadyPassed = this.currentPersonCourses
      .some(pc => pc.status === 3 && pc.course?.moduleId === personCourse.course?.moduleId && pc.courseId !== personCourse.courseId);

    return alreadyPassed;
  }

  // Method to open a confirmation dialog before deletion
  confirmDelete(entity: string | undefined): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      data: {
        message: `Sikker på at fjerne ${entity}?`
      }
    });

    return dialogRef.afterClosed();
  }
}

// Component definition for ChangeEnddateBarComponent
@Component({
  selector: 'app-change-enddate-bar',
  templateUrl: './change-enddate-bar.component.html',
  styleUrls: ['./change-enddate-bar.component.css'],
  standalone: true,
  imports: [MatSnackBarModule]
})

export class ChangeEnddateBarComponent {
  snackbar: any = MatSnackBar;
  person: Person = new Person;

  // Constructor to inject snackbar data (person and snackbar)
  constructor(@Inject(MAT_SNACK_BAR_DATA) private data: { person: Person, snackbar: MatSnackBar }) {
    if (data.snackbar) this.snackbar = data.snackbar;
    if (data.person) this.person = data.person;
  }

  // Method called when the user presses "Yes"
  pressedYes() {
    const temp = new Date(this.person.hiringDate);
    temp.setHours(new Date(this.person.hiringDate).getHours() + 1);
    temp.setFullYear(temp.getFullYear() + 4);
    this.person.endDate = temp;

    // Dismiss the snackbar after setting the end date
    this.snackbar.dismiss();
  }

  // Method called when the user presses "No"
  pressedNo() {
    // Dismiss the snackbar without making any changes
    this.snackbar.dismiss();
  }
}
