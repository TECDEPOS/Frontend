import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/Models/Book';
import { Department } from 'src/app/Models/Department';
import { FileTag } from 'src/app/Models/FileTag';
import { Location } from 'src/app/Models/Location';
import { Module } from 'src/app/Models/Module';
import { Person } from 'src/app/Models/Person';
import { User } from 'src/app/Models/User';
import { UserRole } from 'src/app/Models/UserRole';
import { BookService } from 'src/app/Services/book.service';
import { DepartmentsService } from 'src/app/Services/departments.service';
import { FileTagService } from 'src/app/Services/file-tag.service';
import { LocationsService } from 'src/app/Services/locations.service';
import { ModuleService } from 'src/app/Services/module.service';
import { PersonsService } from 'src/app/Services/persons.service';
import { UserService } from 'src/app/Services/user.service';
import { userViewModel } from 'src/app/Models/ViewModels/addUserViewModel';
import { CourseType } from 'src/app/Models/CourseType';
import { Unsub } from 'src/app/classes/unsub';
import { Observable, findIndex, takeUntil, tap } from 'rxjs';
import { AuthService } from 'src/app/Services/auth.service';
import { changePasswordViewModel } from 'src/app/Models/ViewModels/ChangePasswordViewModel';
import { Sort } from '@angular/material/sort';
import { Course } from 'src/app/Models/Course';
import { Status } from 'src/app/Models/Status';
import { CourseService } from 'src/app/Services/course.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationPopupComponent } from '../../pop-ups/confirmation-popup/confirmation-popup.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarIndicatorComponent } from '../../Misc/snackbar-indicator/snackbar-indicator.component';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent extends Unsub {
  book: Book = new Book();
  department: Department = new Department();
  fileTag: FileTag = new FileTag;
  location: Location = new Location;
  module: Module = new Module;
  course: Course = new Course;
  person: Person = new Person;
  user: User = new User;
  change: changePasswordViewModel = new changePasswordViewModel;
  books: Book[] = [];
  departments: Department[] = [];
  fileTags: FileTag[] = [];
  locations: Location[] = [];
  modules: Module[] = [];
  courses: Course[] = [];
  persons: Person[] = [];
  educationalLeaders: User[] = [];
  educationalConsultants: User[] = [];
  operationCoordinators: User[] = [];
  educationLeaders: User[] = [];
  educationBosses: User[] = [];
  users: User[] = [];
  resentlyCreated: any[] = [];
  activeForm: string | null = null
  activeFormIndex: number | null = null
  activeList: string | null = null
  role: string = '';
  backup: any;
  selectedVisibilityOptions: string[] = [];
  visibilityOptions = [
    { property: 'controllerVisibility', displayName: 'Controller' },
    { property: 'educationLeaderVisibility', displayName: 'Uddannelsesleder' },
    { property: 'educationBossVisibility', displayName: 'Uddannelseschef' },
    { property: 'dkVisibility', displayName: 'Driftskoordinator' },
    { property: 'hrVisibility', displayName: 'Human Resources' },
    { property: 'pkVisibility', displayName: 'Pædagogisk Konsulent' },
  ];

  // Takes the Enums and only get the strings and not the numbers
  courseType: string[] = (Object.values(CourseType) as Array<keyof typeof CourseType>)
    .filter(key => !isNaN(Number(CourseType[key])));

  status: string[] = (Object.values(Status) as Array<keyof typeof Status>)
    .filter(key => !isNaN(Number(Status[key])));

  userRole: string[] = (Object.values(UserRole) as Array<keyof typeof UserRole>)
    .filter(key => !isNaN(Number(UserRole[key])));

  constructor(
    private authService: AuthService,
    private bookService: BookService,
    private departmentService: DepartmentsService,
    private fileTagService: FileTagService,
    private locationService: LocationsService,
    private moduelService: ModuleService,
    private courseService: CourseService,
    private personService: PersonsService,
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder
  ) {
    super();
  }

  ngOnInit() {
    this.role = this.authService.getUserRole();
  }

  // Toggles the form visibility and fetches necessary data based on the active form
  toggleForm(formName: string, i: number) {
    let body = document.getElementById("test")
    if (this.activeForm === formName && this.activeFormIndex === i) {
      this.activeForm = null;
      this.activeFormIndex = null;
    }
    else {
      this.activeForm = formName;
      this.activeFormIndex = i;
      if (this.activeForm == 'moduleForm') {
        this.getBooks();
      }
      else if (this.activeForm == 'personForm') {
        this.getForPerson();
      }
      else if (this.activeForm == 'userForm') {
        this.getForUser();
      }
    }
  }

  // Checks if a form is currently active
  isFormActive(formName: string) {
    return this.activeForm === formName;
  }

  // Toggles the list visibility and fetches necessary data based on the active list
  toggleList(listName: string) {
    if (this.activeList === listName) {
      this.activeList = null
    }
    else {
      this.activeList = listName
      if (this.activeList == 'bookList') {
        this.getBooks();
      }
      else if (this.activeList == 'departmentList') {
        this.getDepartments();
      }
      else if (this.activeList == 'fileTagList') {
        this.getFileTags();
      }
      else if (this.activeList == 'locationList') {
        this.getLocations();
      }
      else if (this.activeList == 'moduleList') {
        this.getModules();
      }
      else if (this.activeList == 'courseList') {
        this.getCourses();
      }
      else if (this.activeList == 'personList') {
        this.getPersons();
      }
      else if (this.activeList == 'userList') {
        this.getUsers();
      }
    }
  }

  // Checks if a list is currently active
  isListActive(formName: string) {
    return this.activeList === formName;
  }

  // Sorts data based on the active sort direction and type
  sortData(sort: Sort, type: string) {
    if (!sort.active || sort.direction === '') {
      return;
    }
    switch (type) {
      case 'book':
        return this.books = this.books.sort((a, b) => {
          const isAsc = sort.direction === 'asc';
          switch (sort.active) {
            case 'name':
              return this.compare(a.name.toLocaleLowerCase(), b.name.toLocaleLowerCase()) * (sort.direction == 'asc' ? 1 : -1);
            case 'amaunt':
              return this.compare(a.amount, b.amount) * (sort.direction == 'asc' ? 1 : -1);
            default:
              return 0;
          }
        });
      case 'department':
        return this.departments = this.departments.sort((a, b) => {
          const isAsc = sort.direction === 'asc';
          switch (sort.active) {
            case 'name':
              return this.compare(a.name.toLocaleLowerCase(), b.name.toLocaleLowerCase()) * (sort.direction == 'asc' ? 1 : -1);
            default:
              return 0;
          }
        });
      case 'fileTag':
        return this.fileTags = this.fileTags.sort((a, b) => {
          const isAsc = sort.direction === 'asc';
          switch (sort.active) {
            case 'name':
              return this.compare(a.tagName.toLocaleLowerCase(), b.tagName.toLocaleLowerCase()) * (sort.direction == 'asc' ? 1 : -1);
            case 'dKVisability':
              return this.compare(a.dkVisibility, b.dkVisibility) * (sort.direction == 'asc' ? 1 : -1);
            case 'hRVisability':
              return this.compare(a.hrVisibility, b.hrVisibility) * (sort.direction == 'asc' ? 1 : -1);
            case 'pKVisability':
            default:
              return 0;
          }
        });
      case 'location':
        return this.locations = this.locations.sort((a, b) => {
          const isAsc = sort.direction === 'asc';
          switch (sort.active) {
            case 'name':
              return this.compare(a.name.toLocaleLowerCase(), b.name.toLocaleLowerCase()) * (sort.direction == 'asc' ? 1 : -1);
            default:
              return 0;
          }
        });
      case 'module':
        return this.modules = this.modules.sort((a, b) => {
          const isAsc = sort.direction === 'asc';
          switch (sort.active) {
            case 'name':
              return this.compare(a.name.toLocaleLowerCase(), b.name.toLocaleLowerCase()) * (sort.direction == 'asc' ? 1 : -1);
            default:
              return 0;
          }
        });
      case 'course':
        return this.courses = this.courses.sort((a, b) => {
          const isAsc = sort.direction === 'asc';
          switch (sort.active) {
            case 'name':
              return this.compare(a.module.name, b.module.name) * (sort.direction == 'asc' ? 1 : -1);
            case 'courseType':
              return this.compare(a.courseType, b.courseType) * (sort.direction == 'asc' ? 1 : -1);
            case 'startDate':
              return this.compare(a.startDate, b.startDate) * (sort.direction == 'asc' ? 1 : -1);
            case 'endDate':
              return this.compare(a.endDate, b.endDate) * (sort.direction == 'asc' ? 1 : -1);
            default:
              return 0;
          }
        });
      case 'person':
        return this.persons = this.persons.sort((a, b) => {
          const isAsc = sort.direction === 'asc';
          switch (sort.active) {
            case 'name':
              return this.compare(a.name, b.name) * (sort.direction == 'asc' ? 1 : -1);
            case 'initials':
              return this.compare(a.initials, b.initials) * (sort.direction == 'asc' ? 1 : -1);
            case 'department':
              return this.compare(a.department?.name, b.department?.name) * (sort.direction == 'asc' ? 1 : -1);
            case 'location':
              return this.compare(a.location, b.location) * (sort.direction == 'asc' ? 1 : -1);
            case 'sVU':
              return this.compare(a.svuEligible, b.svuEligible) * (sort.direction == 'asc' ? 1 : -1);
            default:
              return 0
          }
        });
      case 'user':
        return this.users = this.users.sort((a, b) => {
          const isAsc = sort.direction === 'asc';
          switch (sort.active) {
            case 'name':
              return this.compare(a.name, b.name) * (sort.direction == 'asc' ? 1 : -1);
            case 'username':
              return this.compare(a.userName, b.userName) * (sort.direction == 'asc' ? 1 : -1);
            case 'userRole':
              return this.compare(a.userRole, b.userRole) * (sort.direction == 'asc' ? 1 : -1);
            default:
              return 0
          }
        });
      case '':
      default:
        return 0;
    }
  }

  // Compares two items and returns the sorting order
  compare(itemA: any, itemB: any): number {
    let retVal: number = 0;
    if (itemA && itemB) {
      if (itemA > itemB) retVal = 1;
      else if (itemA < itemB) retVal = -1;
    }
    else if (itemA) retVal = 1;
    else if (itemB) retVal = -1;
    return retVal;
  }

  // Compares objects and returns if they are equal based on their properties
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

  // Sets the department ID based on the selected user department
  selectSetDepartmentId() {
    if (this.user.department == null) {
      this.user.departmentId = null;
    }
    else {
      this.user.departmentId = this.user.department?.departmentId;
    }
  }

  // Sets the location ID based on the selected user location
  selectSetLocationId() {
    if (this.user.location == null) {
      this.user.locationId = null;
    }
    else {
      this.user.locationId = this.user.location.locationId;
    }
  }

  // Method to set education boss ID if the education boss is null
  selectSetEducationbossId() {
    if (this.user.educationBoss == null) {
      this.user.educationBossId = null;
    } else {
      this.user.educationBossId = this.user.educationBoss?.userId;
    }
  }

  // Method to reset certain IDs when user role is changed and not equal to 2
  selectUserRoleChanged() {
    if (this.user.userRole !== 2) {
      this.user.departmentId = null;
      this.user.locationId = null;
      this.user.educationBossId = null;
    }
  }

  // Method to fetch books using book service
  getBooks() {
    this.bookService.getBook().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.books = res;
    })
  }

  // Method to fetch departments using department service
  getDepartments() {
    this.departmentService.getDepartment().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.departments = res;
    })
  }

  // Method to fetch file tags using file tag service
  getFileTags() {
    this.fileTagService.getFileTag().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.fileTags = res;
    })
  }

  // Method to fetch locations using location service
  getLocations() {
    this.locationService.getLocations().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.locations = res;
      console.log(res);
    })
  }

  // Method to fetch modules using module service
  getModules() {
    this.moduelService.getModules().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.modules = res;
    })
  }

  // Method to fetch courses using course service
  getCourses() {
    this.courseService.getAllCourses().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.courses = res;
    })
  }

  // Method to fetch persons using person service
  getPersons() {
    this.personService.getPersons().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.persons = res;
      console.log(res);
    })
  }

  // Method to fetch users using user service
  getUsers() {
    this.userService.getUsers().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.users = res;
    })
  }

  // Method to fetch specific data for persons
  getForPerson() {
    this.userService.getUsers().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.educationLeaders = res.filter(x => x.userRole === 2);
      this.educationalConsultants = res.filter(x => x.userRole === 4);
      this.operationCoordinators = res.filter(x => x.userRole === 6);
      this.departmentService.getDepartment().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
        this.departments = res;
      });
      this.locationService.getLocations().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
        this.locations = res;
      });
    });
  }

  // Method to fetch specific data for users
  getForUser() {
    this.userService.getUsers().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.educationBosses = res.filter(x => x.userRole === 3);
      this.getDepartments();
      this.getLocations();
    })
  }

  // Method to select a book and store it in backup
  bookSelecter(i: number) {
    this.book = JSON.parse(JSON.stringify(this.books[i]));
    this.backup = JSON.parse(JSON.stringify(this.books[i]));
    this.toggleForm('bookForm', i)
  }

  // Method to select a department and store it in backup
  departmentSelecter(i: number) {
    this.department = JSON.parse(JSON.stringify(this.departments[i]));
    this.backup = JSON.parse(JSON.stringify(this.departments[i]));
    this.toggleForm('departmentForm', i)
  }

  // Method to select a file tag and store it in backup
  fileTagSelecter(i: number) {
    this.fileTag = JSON.parse(JSON.stringify(this.fileTags[i]));
    this.backup = JSON.parse(JSON.stringify(this.fileTags[i]));
    this.setFileTagVisibilityDropdown();
    this.toggleForm('fileTagForm', i)
  }

  // Method to select a location and store it in backup
  locationSelecter(i: number) {
    this.location = JSON.parse(JSON.stringify(this.locations[i]));
    this.backup = JSON.parse(JSON.stringify(this.locations[i]));
    this.toggleForm('locationForm', i)
  }

  // Method to select a module and store it in backup
  moduleSelecter(i: number) {
    this.module = JSON.parse(JSON.stringify(this.modules[i]));
    this.backup = JSON.parse(JSON.stringify(this.modules[i]));
    this.toggleForm('moduleForm', i)
  }

  // Method to select a course and store it in backup
  courseSelecter(i: number) {
    this.course = JSON.parse(JSON.stringify(this.courses[i]));
    this.backup = JSON.parse(JSON.stringify(this.courses[i]));
    this.toggleForm('courseForm', i)
  }

  // Method to select a person and fetch associated data
  personSelecter(i: number) {
    this.person = JSON.parse(JSON.stringify(this.persons[i]));
    console.log(this.person);
    this.backup = JSON.parse(JSON.stringify(this.persons[i]));
    this.getForPerson();
    this.toggleForm('personForm', i)
  }

  // Method to select a user and fetch associated data
  userSelecter(i: number) {
    this.user = JSON.parse(JSON.stringify(this.users[i]));
    this.backup = JSON.parse(JSON.stringify(this.users[i]));
    this.getForUser();
    this.toggleForm('userForm', i)
  }

  // Method to edit a book and update the list
  editBook() {
    this.book.module.books = [];
    this.bookService.updateBook(this.book).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.books[this.books.findIndex(x => x.bookId == res.bookId)] = res;
      this.backup = JSON.parse(JSON.stringify(res));
      this.openSnackBar('Bog')
    })
  }

  // Method to edit a department and update the list
  editDepartment() {
    this.departmentService.updateDepartment(this.department).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.departments[this.departments.findIndex(x => x.departmentId == res.departmentId)] = res;
      this.backup = JSON.parse(JSON.stringify(res));
      this.openSnackBar('Afdeling')
    })
  }

  // Method to edit a file tag and update the list
  editFileTag() {
    this.fileTagService.updateFileTag(this.fileTag).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.fileTags[this.fileTags.findIndex(x => x.fileTagId == res.fileTagId)] = res;
      this.backup = JSON.parse(JSON.stringify(res));
      this.openSnackBar('Filkategori')
    })
  }

  // Method to edit a location and update the list
  editLocation() {
    this.locationService.updateLocation(this.location).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.locations[this.locations.findIndex(x => x.locationId == res.locationId)] = res;
      this.backup = JSON.parse(JSON.stringify(res));
      this.openSnackBar('Lokation')
    })
  }

  // Method to edit a module and update the list
  editModule() {
    this.module.books = [];
    this.moduelService.updateModule(this.module).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.modules[this.modules.findIndex(x => x.moduleId == res.moduleId)] = res;
      this.backup = JSON.parse(JSON.stringify(res));
      this.openSnackBar('Modul')
    })
  }

  // Method to edit a course and update the list
  editCourse() {
    this.courseService.updateCourse(this.course).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.courses[this.courses.findIndex(x => x.moduleId == res.moduleId)] = res;
      this.backup = JSON.parse(JSON.stringify(res));
      this.openSnackBar('Kursus')
    })
  }

  // Method to edit a person and update the list
  editPerson() {
    this.personService.updatePerson(this.person).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.persons[this.persons.findIndex(x => x.personId == res.personId)] = res;
      this.backup = JSON.parse(JSON.stringify(res));
      this.openSnackBar('Underviser')
    });
  }

  // Method to edit a user and update the list
  editUser() {
    this.userService.updateUser(this.user).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.users[this.users.findIndex(x => x.userId == res.userId)] = res;
      this.backup = JSON.parse(JSON.stringify(res));
      this.openSnackBar('Bruger')
    });
  }

  // Method to delete a book after confirmation
  deleteBook(book: Book) {
    this.confirmDelete(book.name).pipe(takeUntil(this.unsubscribe$)).subscribe(confirmed => {
      if (confirmed) {
        this.bookService.deleteBook(book.bookId).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
          this.books = this.books.filter(x => x.bookId != book.bookId);
          this.activeForm = null;
        });
      }
    });
  }

  // Method to delete a department after confirmation
  deleteDepartment(department: Department) {
    this.confirmDelete(department.name).pipe(takeUntil(this.unsubscribe$)).subscribe(confirmed => {
      if (confirmed) {
        this.departmentService.deleteDepartment(department.departmentId).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
          this.departments = this.departments.filter(x => x.departmentId != department.departmentId);
          this.activeForm = null;
        });
      }
    });
  }

  // Method to delete a file tag after confirmation
  deleteFileTag(fileTag: FileTag) {
    this.confirmDelete(fileTag.tagName).pipe(takeUntil(this.unsubscribe$)).subscribe(confirmed => {
      if (confirmed) {
        this.fileTagService.deleteFiletag(fileTag.fileTagId).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
          this.fileTags = this.fileTags.filter(x => x.fileTagId != fileTag.fileTagId);
          this.activeForm = null;
        });
      }
    });
  }

  // Method to delete a location after confirmation
  deleteLocation(location: Location) {
    this.confirmDelete(location.name).pipe(takeUntil(this.unsubscribe$)).subscribe(confirmed => {
      if (confirmed) {
        this.locationService.deleteLocation(location.locationId).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
          this.locations = this.locations.filter(x => x.locationId != location.locationId);
          this.activeForm = null;
        });
      }
    });
  }

  // Method to delete a module after confirmation
  deleteModule(module: Module) {
    this.confirmDelete(module.name).pipe(takeUntil(this.unsubscribe$)).subscribe(confirmed => {
      if (confirmed) {
        this.moduelService.deleteModule(module.moduleId).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
          this.modules = this.modules.filter(x => x.moduleId != module.moduleId);
          this.activeForm = null;
        });
      }
    });
  }

  // Method to delete a course after confirmation
  deleteCourse(course: Course) {
    this.confirmDelete('Kursus').pipe(takeUntil(this.unsubscribe$)).subscribe(confirmed => {
      if (confirmed) {
        this.courseService.deleteCourse(course.courseId).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
          this.courses = this.courses.filter(x => x.courseId != course.courseId);
          this.activeForm = null;
        });
      }
    });
  }

  // Method to delete a person after confirmation
  deletePerson(person: Person) {
    this.confirmDelete(person.name).pipe(takeUntil(this.unsubscribe$)).subscribe(confirmed => {
      if (confirmed) {
        this.personService.deletePerson(person.personId).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
          this.persons = this.persons.filter(x => x.personId != person.personId);
          this.activeForm = null;
        });
      }
    });
  }

  // Method to delete a user after confirmation
  deleteUser(user: User) {
    this.confirmDelete(user.name).pipe(takeUntil(this.unsubscribe$)).subscribe(confirmed => {
      if (confirmed) {
        this.userService.deleteUser(user.userId).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
          this.users = this.users.filter(x => x.userId != user.userId);
          this.activeForm = null;
        });
      }
    });
  }

  // Method to reset the password of a user
  resetPassword(id: number) {
    this.change.userId = id
    this.authService.resetPassword(this.change).pipe(takeUntil(this.unsubscribe$)).subscribe(res => { })
  }

  // Method to cancel edits and restore backup data
  cancel(type: string) {
    switch (type) {
      case 'book':
        return this.book = JSON.parse(JSON.stringify(this.backup));
      case 'department':
        return this.department = JSON.parse(JSON.stringify(this.backup));
      case 'fileTag':
        this.fileTag = JSON.parse(JSON.stringify(this.backup));
        this.setFileTagVisibilityDropdown();
        return;
      case 'location':
        return this.location = JSON.parse(JSON.stringify(this.backup));
      case 'module':
        return this.module = JSON.parse(JSON.stringify(this.backup));
      case 'course':
        return this.course = JSON.parse(JSON.stringify(this.backup));
      case 'person':
        return this.person = JSON.parse(JSON.stringify(this.backup));
      case 'user':
        return this.user = JSON.parse(JSON.stringify(this.backup));
      case '':
      default:
        return 0;
    }
  }

  // Method to open confirmation dialog for delete operation
  confirmDelete(entity: string): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      data: {
        message: `Slet ${entity}?`
      }
    });

    return dialogRef.afterClosed();
  }

  // Method to show snackbar when an entity is updated
  openSnackBar(entity: string) {
    this.snackBar.openFromComponent(SnackbarIndicatorComponent, {
      data: {
        message: `${entity} opdateret`
      }, panelClass: ['blue-snackbar'], duration: 3000
    });
  }

  // Method to set visibility options for file tag dropdown
  setFileTagVisibilityDropdown() {
    this.selectedVisibilityOptions = this.visibilityOptions
      .filter((option) => this.fileTag[option.property])
      .map((option) => option.property);
  }
}