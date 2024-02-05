import { FormGroup, FormControl } from '@angular/forms';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { CourseService } from 'src/app/Services/course.service';
import { Course } from 'src/app/Models/Course';
import { AuthService } from 'src/app/Services/auth.service';
import { getLocaleDateTimeFormat, getLocaleTimeFormat } from '@angular/common';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent extends Unsub implements OnInit {
  book: Book = new Book;
  department: Department = new Department;
  course: Course = new Course;
  fileTag: FileTag = new FileTag;
  location: Location = new Location;
  module: Module = new Module;
  person: Person = new Person;
  user: userViewModel = new userViewModel;
  books: Book[] = [];
  departments: Department[] = [];
  locations: Location[] = [];
  modules: Module[] = [];
  persons: Person[] = [];
  resentlyCreated: Person[] = [];
  educationBosses: User[] = [];
  educationalConsultants: User[] = [];
  operationCoordinators: User[] = [];
  showEducationBoss: boolean = false;
  activeForm: string | null = null
  role: string = '';

  bookForm: FormGroup;
  courseForm: FormGroup;
  depertmentForm: FormGroup;
  fileTagForm: FormGroup;
  locationForm: FormGroup;
  moduleForm: FormGroup;
  personForm: FormGroup;
  userForm: FormGroup;

  // Takes the Enums and only get the strings and not the numbers
  courseType: string[] = (Object.values(CourseType) as Array<keyof typeof CourseType>)
    .filter(key => !isNaN(Number(CourseType[key])));

  userRole: string[] = (Object.values(UserRole) as Array<keyof typeof UserRole>)
    .filter(key => !isNaN(Number(UserRole[key])));

  constructor(
    private authService: AuthService,
    private bookService: BookService,
    private departmentService: DepartmentsService,
    private fileTagService: FileTagService,
    private courseService: CourseService,
    private locationService: LocationsService,
    private moduleService: ModuleService,
    private personService: PersonsService,
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    super();
    this.bookForm = new FormGroup({});
    this.courseForm = new FormGroup({});
    this.depertmentForm = new FormGroup({});
    this.fileTagForm = new FormGroup({});
    this.locationForm = new FormGroup({});
    this.moduleForm = new FormGroup({});
    this.personForm = new FormGroup({});
    this.userForm = new FormGroup({});
  }

  ngOnInit() {
    this.role = this.authService.getUserRole();
  }

  toggleForm(formName: string) {
    if (this.activeForm === formName) {
      this.activeForm = null
    }
    else {
      this.activeForm = formName
      
      if (this.activeForm == 'bookForm') {
        this.getModules();
      }
      else if (this.activeForm == 'courseForm') {
        this.getModules();
      }
      else if (this.activeForm == 'personForm') {
        this.getForPerson();
      }
      else if (this.activeForm == 'userForm')
      {
        this.getForUser();
      }
    }
  }

  isFormActive(formName: string) {
    return this.activeForm === formName;
  }

  getModules() {
    this.moduleService.getModules().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.modules = res;
      console.log(this.modules);
      
    })
  }
  
  getForPerson() {
    this.userService.getUsers().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.educationalConsultants = res.filter(x => x.userRole === 4);
      console.log(this.educationalConsultants);
      
      this.operationCoordinators = res.filter(x => x.userRole === 6);
      console.log(this.operationCoordinators);
      
      this.departmentService.getDepartment().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
        this.departments = res;
      });
      this.locationService.getLocations().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
        this.locations = res;
      });
    });
  }
  
  getForUser() {    
    this.userService.getUsersByUserRole(2).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.educationBosses = res;
    });
    this.departmentService.getDepartment().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.departments = res;
    });
    this.locationService.getLocations().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.locations = res;
    });
  }

  personPicker(id: number) {
    this.router.navigate(['/employee/', id])
  }

  onRoleChange(userRole: UserRole) {
    if(userRole == 3)
    {
      this.showEducationBoss = true;      
    }
    else
    {
      this.showEducationBoss = false;
      this.user.educationBossId = null;
    }

    this.cdr.detectChanges();
  }

  created(created: any) {
    this.resentlyCreated.unshift(created)
  }

  createBook() {
    this.bookService.addBook(this.book).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.book = new Book;
    });
  }

  createDepartment() {
    this.departmentService.addDepartment(this.department).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.department = new Department;
    })
  }

  createFileTag() {
    this.fileTagService.createFileTag(this.fileTag).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.fileTag = new FileTag;
    })
  }

  createCourse() {
    this.courseService.addCourses(this.course).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.course = new Course;
      console.log(res);
      
    })
  }

  createLocation() {
    this.locationService.addLocation(this.location).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.location = new Location;
    })
  }

  createModule() {
    this.moduleService.addModule(this.module).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.module = new Module;
    })
  }

  createPerson() {
    this.person.endDate = this.person.hiringDate;    
    this.personService.addPerson(this.person).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.created(res)
      this.person = new Person;
    })
  }

  createUser() {
    this.userService.addUsers(this.user).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.user = new userViewModel;
    })
  }
}
