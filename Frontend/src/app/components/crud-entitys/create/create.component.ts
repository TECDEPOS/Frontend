import { FormGroup, FormControl } from '@angular/forms';
import { Component } from '@angular/core';
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
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent {
  book: Book = new Book;
  department: Department = new Department;
  fileTag: FileTag = new FileTag;
  location: Location = new Location;
  moduel: Module = new Module;
  person: Person = new Person;
  user: User = new User;
  departments: Department[] = [];
  locations: Location[] = [];
  modules: Module[] = [];
  educationalConsultants: User[] = [];
  operationCoordinators: User[] = [];
  resentlyCreated: any[] = [];
  selected: number = 1;

  bookForm: FormGroup;
  depertmentForm: FormGroup;
  fileTagForm: FormGroup;
  locationForm: FormGroup;
  moduelForm: FormGroup;
  personForm: FormGroup;
  userForm: FormGroup;

  public userRole = UserRole;

  constructor(
    private bookService: BookService,
    private depertmentService: DepartmentsService,
    private fileTagService: FileTagService,
    private locationService: LocationsService,
    private moduelService: ModuleService,
    private personService: PersonsService,
    private userService: UserService
  ) {
    this.bookForm = new FormGroup({})

    this.depertmentForm = new FormGroup({})

    this.fileTagForm = new FormGroup({})

    this.locationForm = new FormGroup({})

    this.moduelForm = new FormGroup({})

    // this.personForm = new FormGroup({});

    this.personForm = new FormGroup({
      name: new FormControl(''),
      initials: new FormControl(''),
      educationalConsultantUserId: new FormControl(0),
      operationCoordinatorUserId: new FormControl(0),
      hiringDate: new FormControl(),
      svu: new FormControl(false)
    });

    this.userForm = new FormGroup({
      username: new FormControl(''),
      name: new FormControl(''),
      userRole: new FormControl()
    });
  }

  ngOnInit() {
    console.log(this.userRole);

  }

  createBook() {

  }

  createDepartment() {

  }

  createFileTag() {

  }

  createLocation() {

  }

  createModule() {

  }

  createPerson() {
    console.log(this.personForm.controls);
    console.log(this.person);
    
    
  }

  createUser() {

  }
}
