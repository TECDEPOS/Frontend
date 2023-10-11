import { FormGroup, FormControl } from '@angular/forms';
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
import { ModuleType } from 'src/app/Models/ModuleType';
import { Unsub } from 'src/app/classes/unsub';
import { findIndex, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/Services/auth.service';
import { changePasswordViewModel } from 'src/app/Models/ViewModels/ChangePasswordViewModel';
import { Sort } from '@angular/material/sort';
import { PersonModule } from 'src/app/Models/PersonModule';
import { PersonModuleService } from 'src/app/Services/person-module.service';
import { Status } from 'src/app/Models/status';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent extends Unsub {
  book: Book = new Book;
  department: Department = new Department;
  fileTag: FileTag = new FileTag;
  location: Location = new Location;
  module: Module = new Module;
  personModule: PersonModule = new PersonModule;
  person: Person = new Person;
  user: User = new User;
  change: changePasswordViewModel = new changePasswordViewModel;
  books: Book[] = [];
  departments: Department[] = [];
  fileTags: FileTag[] = [];
  locations: Location[] = [];
  modules: Module[] = [];
  personModules: PersonModule[] = [];
  persons: Person[] = [];
  educationalConsultants: User[] = [];
  operationCoordinators: User[] = [];
  users: User[] = [];
  resentlyCreated: any[] = [];
  activeForm: string | null = null
  activeFormIndex: number | null = null
  activeList: string | null = null
  role: string = '';
  backup: any;

  bookForm: FormGroup;
  depertmentForm: FormGroup;
  fileTagForm: FormGroup;
  locationForm: FormGroup;
  moduleForm: FormGroup;
  personModuleForm: FormGroup;
  personForm: FormGroup;
  userForm: FormGroup;

  moduleType: string[] = (Object.values(ModuleType) as Array<keyof typeof ModuleType>)
    .filter(key => !isNaN(Number(ModuleType[key])));

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
    private personModuleService: PersonModuleService,
    private personService: PersonsService,
    private userService: UserService
  ) {
    super();
    this.bookForm = new FormGroup({});
    this.depertmentForm = new FormGroup({});
    this.fileTagForm = new FormGroup({});
    this.locationForm = new FormGroup({});
    this.moduleForm = new FormGroup({});
    this.personModuleForm = new FormGroup({});
    this.personForm = new FormGroup({});
    this.userForm = new FormGroup({});
  }

  ngOnInit() {
    this.role = this.authService.getUserRole();
  }


  toggleForm(formName: string, i: number) {
    let body = document.getElementById("test")
    if (this.activeForm === formName && this.activeFormIndex === i) {
      this.activeForm = null;
      this.activeFormIndex = null;
      body?.classList.remove("innerBoxV2")
      body?.classList.add("innerBox")
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
      body?.classList.remove("innerBox")
      body?.classList.add("innerBoxV2")
    }
  }

  isFormActive(formName: string) {
    return this.activeForm === formName;
  }

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
      else if (this.activeList == 'personModuleList') {
        this.getPersonModules();
      }
      else if (this.activeList == 'personList') {
        this.getPersons();
      }
      else if (this.activeList == 'userList') {
        this.getUsers();
      }
    }
  }

  isListActive(formName: string) {
    return this.activeList === formName;
  }

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
              return this.compare(a.dkVisability, b.dkVisability) * (sort.direction == 'asc' ? 1 : -1);
            case 'hRVisability':
              return this.compare(a.hrVisability, b.hrVisability) * (sort.direction == 'asc' ? 1 : -1);
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
      case 'personModule':
        return this.personModules = this.personModules.sort((a, b) => {
          const isAsc = sort.direction === 'asc';
          switch (sort.active) {
            case 'personName':
              return this.compare(a.person.name.toLocaleLowerCase(), b.person.name.toLocaleLowerCase()) * (sort.direction == 'asc' ? 1 : -1);
            case 'initials':
              return this.compare(a.person.initials.toLocaleLowerCase(), b.person.initials.toLocaleLowerCase()) * (sort.direction == 'asc' ? 1 : -1);
            case 'moduleName':
              return this.compare(a.module.name.toLocaleLowerCase(), b.module.name.toLocaleLowerCase()) * (sort.direction == 'asc' ? 1 : -1);
            case 'status':
              return this.compare(a.status, b.status) * (sort.direction == 'asc' ? 1 : -1);
            case 'moduleType':
              return this.compare(a.moduleType, b.moduleType) * (sort.direction == 'asc' ? 1 : -1);
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

  compareObjects(o1: any, o2: any): boolean {
    if (o2 == null) {
      return false;
    }

    if (typeof (o2 == Location)) {
      return o1.name === o2.name && o1.locationId === o2.locationId;
    }
    else if (typeof (o2 == Department)) {
      console.log("2");
      return o1.name === o2.name && o1.departmentId === o2.departmentId;
    }
    else if (typeof (o2 == User)) {
      return o1.name === o2.name && o1.userId === o2.userId;
    }
    else {
      return false;
    }
  }

  getBooks() {
    this.bookService.getBook().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.books = res;
    })
  }

  getDepartments() {
    this.departmentService.getDepartment().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.departments = res;
    })
  }

  getFileTags() {
    this.fileTagService.getFileTag().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.fileTags = res;
    })
  }

  getLocations() {
    this.locationService.getLocations().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.locations = res;
    })
  }

  getModules() {
    this.moduelService.getModule().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.modules = res;
    })
  }

  getPersonModules() {
    this.personModuleService.getAllPersonModules().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.personModules = res;
    })
  }

  getPersons() {
    this.personService.getPersons().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.persons = res;
      console.log(res);

    })
  }

  getUsers() {
    this.userService.getUsers().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.users = res;
    })
  }

  getForPerson() {
    this.userService.getUsers().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.educationalConsultants = res.filter(x => x.userRole === 1 || x.userRole === 4);
      this.operationCoordinators = res.filter(x => x.userRole === 3 || x.userRole === 6);
      this.departmentService.getDepartment().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
        this.departments = res;
      });
      this.locationService.getLocations().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
        this.locations = res;
      });
    });
  }

  bookSelecter(i: number) {
    this.book = JSON.parse(JSON.stringify(this.books[i]));
    this.backup = JSON.parse(JSON.stringify(this.books[i]));
    this.toggleForm('bookForm', i)
  }

  departmentSelecter(i: number) {
    this.department = JSON.parse(JSON.stringify(this.departments[i]));
    this.backup = JSON.parse(JSON.stringify(this.departments[i]));
    this.toggleForm('departmentForm', i)
  }

  fileTagSelecter(i: number) {
    this.fileTag = JSON.parse(JSON.stringify(this.fileTags[i]));
    this.backup = JSON.parse(JSON.stringify(this.fileTags[i]));
    this.toggleForm('fileTagForm', i)
  }

  locationSelecter(i: number) {
    this.location = JSON.parse(JSON.stringify(this.locations[i]));
    this.backup = JSON.parse(JSON.stringify(this.locations[i]));
    this.toggleForm('locationForm', i)
  }

  moduleSelecter(i: number) {
    this.module = JSON.parse(JSON.stringify(this.modules[i]));
    this.backup = JSON.parse(JSON.stringify(this.modules[i]));
    this.toggleForm('moduleForm', i)
  }

  personModuleSelecter(i: number) {
    this.personModule = JSON.parse(JSON.stringify(this.personModules[i]));
    this.backup = JSON.parse(JSON.stringify(this.personModules[i]));
    this.toggleForm('personModuleForm', i)
  }

  personSelecter(i: number) {
    this.person = JSON.parse(JSON.stringify(this.persons[i]));
    this.backup = JSON.parse(JSON.stringify(this.persons[i]));
    this.getForPerson();
    this.toggleForm('personForm', i)
  }

  userSelecter(i: number) {
    this.user = JSON.parse(JSON.stringify(this.users[i]));
    this.backup = JSON.parse(JSON.stringify(this.users[i]));
    this.toggleForm('userForm', i)
  }

  editBook() {
    this.bookService.updateBook(this.book).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {       
      this.books[this.books.findIndex(x => x.bookId == res.bookId)] = res;
      this.backup = JSON.parse(JSON.stringify(res));
    })
  }

  editDepartment() {
    this.departmentService.updateDepartment(this.department).pipe(takeUntil(this.unsubscribe$)).subscribe(res => { 
      this.departments[this.departments.findIndex(x => x.departmentId == res.departmentId)] = res;
      this.backup = JSON.parse(JSON.stringify(res));
    })
  }

  editFileTag() {
    this.fileTagService.updateFileTag(this.fileTag).pipe(takeUntil(this.unsubscribe$)).subscribe(res => { 
      this.fileTags[this.fileTags.findIndex(x => x.fileTagId == res.fileTagId)] = res;
      this.backup = JSON.parse(JSON.stringify(res));
    })
  }

  editLocation() {
    this.locationService.updateLocation(this.location).pipe(takeUntil(this.unsubscribe$)).subscribe(res => { 
      this.locations[this.locations.findIndex(x => x.locationId == res.locationId)] = res;
      this.backup = JSON.parse(JSON.stringify(res));
    })
  }

  editModule() {
    this.moduelService.updateModule(this.module).pipe(takeUntil(this.unsubscribe$)).subscribe(res => { 
      this.modules[this.modules.findIndex(x => x.moduleId == res.moduleId)] = res;
      this.backup = JSON.parse(JSON.stringify(res));
    })
  }

  editPersonModule() {
    this.personModuleService.updatepersonModules(this.personModule).pipe(takeUntil(this.unsubscribe$)).subscribe(res => { 
      this.personModules[this.personModules.findIndex(x => x.moduleId == res.moduleId)] = res;
      this.backup = JSON.parse(JSON.stringify(res));
    })
  }

  editPerson() {
    this.personService.updatePerson(this.person).pipe(takeUntil(this.unsubscribe$)).subscribe(res => { 
      this.persons[this.persons.findIndex(x => x.personId == res.personId)] = res;
      this.backup = JSON.parse(JSON.stringify(res));
    })
  }

  editUser() {
    this.userService.updateUser(this.user).pipe(takeUntil(this.unsubscribe$)).subscribe(res => { 
      this.users[this.users.findIndex(x => x.userId == res.userId)] = res;
      this.backup = JSON.parse(JSON.stringify(res));
    })
  }

  deleteBook(id: number) {
    this.bookService.deleteBook(id).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.books = this.books.filter(x => x.bookId != id);
      this.activeForm = null;
    })
  }

  deleteDepartment(id: number) {
    this.departmentService.deleteDepartment(id).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.departments = this.departments.filter(x => x.departmentId != id);
      this.activeForm = null;
    })
  }

  deleteFileTag(id: number) {
    this.fileTagService.deleteFiletag(id).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.fileTags = this.fileTags.filter(x => x.fileTagId != id);
      this.activeForm = null;
    })
  }

  deleteLocation(id: number) {
    this.locationService.deleteLocation(id).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.locations = this.locations.filter(x => x.locationId != id);
      this.activeForm = null;
    })
  }

  deleteModule(id: number) {
    this.moduelService.deleteModule(id).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.modules = this.modules.filter(x => x.moduleId != id);
      this.activeForm = null;
    })
  }

  deletePersonModule(id: number) {
    this.personModuleService.deletePersonModule(id).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.personModules = this.personModules.filter(x => x.moduleId != id);
      this.activeForm = null;
    })
  }

  deletePerson(id: number) {
    this.personService.deletePerson(id).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.persons = this.persons.filter(x => x.personId != id);
      this.activeForm = null;
    })
  }

  deleteUser(id: number) {
    console.log(id);
    
    this.userService.deleteUser(id).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.users = this.users.filter(x => x.userId != id);
      this.activeForm = null;
    })
  }

  resetPassword(id: number) {
    this.change.userId = id
    this.authService.resetPassword(this.change).pipe(takeUntil(this.unsubscribe$)).subscribe(res => { })
  }

  cancel(type: string) {
    switch (type) {
      case 'book':
        return this.book = JSON.parse(JSON.stringify(this.backup));
      case 'department':
        return this.department = JSON.parse(JSON.stringify(this.backup));
      case 'fileTag':
        return this.fileTag = JSON.parse(JSON.stringify(this.backup));
      case 'location':
        return this.location = JSON.parse(JSON.stringify(this.backup));
      case 'module':
        return this.module = JSON.parse(JSON.stringify(this.backup));
      case 'personModule':
        return this.personModule = JSON.parse(JSON.stringify(this.backup));
      case 'person':
        return this.person = JSON.parse(JSON.stringify(this.backup));
      case 'user':
        return this.user = JSON.parse(JSON.stringify(this.backup));
      case '':
      default:
        return 0;
    }
  }
}