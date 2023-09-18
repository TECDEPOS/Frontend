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


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent extends Unsub{
  book: Book = new Book;
  department: Department = new Department;
  fileTag: FileTag = new FileTag;
  location: Location = new Location;
  module: Module = new Module;
  person: Person = new Person;
  user: userViewModel = new userViewModel;
  changePasswordViewModel: changePasswordViewModel = new changePasswordViewModel
  books: Book[] = [];
  departments: Department[] = [];
  fileTags: FileTag[] = [];
  locations: Location[] = [];
  modules: Module[] = [];
  persons: Person[] = [];
  educationalConsultants: User[] = [];
  operationCoordinators: User[] = [];
  users: User[] = [];
  resentlyCreated: any[] = [];
  activeList: string | null = null

  bookForm: FormGroup;
  depertmentForm: FormGroup;
  fileTagForm: FormGroup;
  locationForm: FormGroup;
  moduleForm: FormGroup;
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
    private personService: PersonsService,
    private userService: UserService
  ) {
    super();
    this.bookForm = new FormGroup({});
    this.depertmentForm = new FormGroup({});
    this.fileTagForm = new FormGroup({});
    this.locationForm = new FormGroup({});
    this.moduleForm = new FormGroup({});
    this.personForm = new FormGroup({});
    this.userForm = new FormGroup({});
  }

  ngOnInit() {
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
        this.getDepartmens();
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

  getBooks() {
    this.bookService.getBook().subscribe(res => {
      this.books = res;
    })
  }


  getDepartmens() {
    this.departmentService.getDepartment().subscribe(res => {
      this.departments = res;
    })
  }

  getFileTags() {
    this.fileTagService.getFileTag().subscribe(res => {
      this.fileTags = res;
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

  getPersons() {
    this.personService.getPersons().subscribe(res => {
      this.persons = res;
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

  editBook() {
    this.bookService.updateBook(this.book).subscribe(res => {
    })
  }

  editDepartmen() {
    this.departmentService.updateDepartment(this.department).subscribe(res => {
    })
  }

  editFileTag() {
    this.fileTagService.updateFileTag(this.fileTag).subscribe(res => {
    })
  }

  editLocation() {
    this.locationService.updateLocation(this.location).subscribe(res => {
      
    })
  }

  editModule() {
    this.moduelService.updateModule(this.module).subscribe(res => {
      
    })
  }

  editPerson() {
    this.personService.updatePerson(this.person).subscribe(res => {
      
    })
  }

  // editUser() {
  //   this.userService.updatePerson(this.user).subscribe(res => {
      
  //   })
  // }

  changePassword() {
    this.authService.changePassword(this.changePasswordViewModel).subscribe(res => {
      
    })
  }

}
