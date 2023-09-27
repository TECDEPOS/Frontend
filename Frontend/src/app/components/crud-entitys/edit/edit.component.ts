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
import { takeUntil } from 'rxjs';
import { AuthService } from 'src/app/Services/auth.service';
import { changePasswordViewModel } from 'src/app/Models/ViewModels/ChangePasswordViewModel';
import { Sort } from '@angular/material/sort';
import { PersonModule } from 'src/app/Models/PersonModule';
import { PersonModuleService } from 'src/app/Services/person-module.service';


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
  }

  toggleForm(formName: string, i: number) {
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
    }
  }

  isFormActive(formName: string) {
    return this.activeForm === formName;
  }

  toggleList(formName: string) {
    if (this.activeList === formName) {
      this.activeList = null
    }
    else {
      this.activeList = formName
      if (this.activeList == 'bookList') {
        this.getBooks();
      }
      else if (this.activeList == 'depertmentList') {
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
            case '':
              return this.compare(a.status, b.status) * (sort.direction == 'asc' ? 1 : -1);
            case '':
              return this.compare(a.moduleType, b.moduleType) * (sort.direction == 'asc' ? 1 : -1);
            case '':
              return this.compare(a.startDate, b.startDate) * (sort.direction == 'asc' ? 1 : -1);
            case '':
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

  getBooks() {
    this.bookService.getBook().subscribe(res => {
      this.books = res;
    })
  }

  getDepartments() {
    this.departmentService.getDepartment().subscribe(res => {
      this.departments = res;
    })
  }

  getFileTags() {
    this.fileTagService.getFileTag().subscribe(res => {
      this.fileTags = res;
      console.log(res);

    })
  }

  getLocations() {
    this.locationService.getLocations().subscribe(res => {
      this.locations = res;
    })
  }

  getModules() {
    this.moduelService.getModule().subscribe(res => {
      this.modules = res;
    })
  }

  getPersonModules() {
    // this.personModuleService()
  }

  getPersons() {
    this.personService.getPersons().subscribe(res => {
      this.persons = res;
      console.log(res);


    })
  }

  getUsers() {
    this.userService.getUsers().subscribe(res => {
      this.users = res;
    })
  }

  getForPerson() {
    this.userService.getUsers().subscribe(res => {
      this.educationalConsultants = res.filter(x => x.userRole === 1 || x.userRole === 4);
      this.operationCoordinators = res.filter(x => x.userRole === 3 || x.userRole === 6);
      this.departmentService.getDepartment().subscribe(res => {
        this.departments = res;
      });
      this.locationService.getLocations().subscribe(res => {
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
    this.toggleForm('departmentForm', i)
  }

  fileTagSelecter(i: number) {
    this.fileTag = JSON.parse(JSON.stringify(this.fileTags[i]));
    this.toggleForm('fileTagForm', i)
  }

  locationSelecter(i: number) {
    this.location = JSON.parse(JSON.stringify(this.locations[i]));
    this.toggleForm('locationForm', i)
  }

  moduleSelecter(i: number) {
    this.module = JSON.parse(JSON.stringify(this.modules[i]));
    this.toggleForm('moduleForm', i)
  }

  personSelecter(i: number) {
    this.person = JSON.parse(JSON.stringify(this.persons[i]));
    this.getForPerson();
    this.toggleForm('personForm', i)
  }

  userSelecter(i: number) {
    this.user = JSON.parse(JSON.stringify(this.users[i]));
    this.toggleForm('userForm', i)
  }

  editBook() {
    this.bookService.updateBook(this.book).subscribe(res => { })
  }

  editDepartment() {
    this.departmentService.updateDepartment(this.department).subscribe(res => { })
  }

  editFileTag() {
    this.fileTagService.updateFileTag(this.fileTag).subscribe(res => { })
  }

  editLocation() {
    this.locationService.updateLocation(this.location).subscribe(res => { })
  }

  editModule() {
    this.moduelService.updateModule(this.module).subscribe(res => { })
  }

  editPersonModule() {

  }

  editPerson() {
    this.personService.updatePerson(this.person).subscribe(res => { })
  }

  editUser() {
    this.userService.updateUser(this.user).subscribe(res => { })
  }

  resetPassword(id: number) {
    this.authService.resetPassword(id).subscribe(res => { })
  }

  cancel() {
    this.book = JSON.parse(JSON.stringify(this.backup));
    console.log(this.book);
  }
}