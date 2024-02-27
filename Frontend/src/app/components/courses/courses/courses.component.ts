import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Sort } from '@angular/material/sort';
import { pipe, takeUntil } from 'rxjs';
import { Course } from 'src/app/Models/Course';
import { CourseType } from 'src/app/Models/CourseType';
import { Module } from 'src/app/Models/Module';
import { Person } from 'src/app/Models/Person';
import { PersonCourse } from 'src/app/Models/PersonCourse';
import { Status } from 'src/app/Models/Status';
import { User } from 'src/app/Models/User';
import { AuthService } from 'src/app/Services/auth.service';
import { CourseService } from 'src/app/Services/course.service';
import { ModuleService } from 'src/app/Services/module.service';
import { PersonCourseService } from 'src/app/Services/person-course.service';
import { PersonsService } from 'src/app/Services/persons.service';
import { UserService } from 'src/app/Services/user.service';
import { Unsub } from 'src/app/classes/unsub';
import { AddPersonCourseComponent } from '../../pop-ups/add-person-course/add-person-course.component';
import { MatDialog } from '@angular/material/dialog';
import { AddPersonToCourseComponent } from '../../pop-ups/add-person-to-course/add-person-to-course.component';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent extends Unsub {
  any: any = 'Alle';
  anyEducationBoss: boolean = true;
  anyType: boolean = true;
  courseSelected: boolean = false;
  personSelected: boolean = false;
  showEducationBossesDropdown: boolean = false;
  leaderView: boolean = false;
  activeCourseList: number | null = null
  activeLeaderList: number | null = null
  selectedCourseId: number = 0;
  selectedModuleId: number = 0;
  selectedPersonId: number = 0;
  role: string = '';
  selectedEducationBoss: number = this.any;
  selectedTypes: CourseType[] = [this.any];
  module: Module = new Module;
  courses: Course[] = [];
  showedCourseList: Course[] = [];
  modules: Module[] = [];
  leaderPersons: Person[] = [];
  persons: Person[] = [];
  personsCoureses: PersonCourse[] = [];
  educationBosses: User[] = [];
  educationLeaders: User[] = [];
  showedLeaderList: User[] = [];


  courseType: string[] = (Object.values(CourseType) as Array<keyof typeof CourseType>)
    .filter(key => !isNaN(Number(CourseType[key])));

  status: string[] = (Object.values(Status) as Array<keyof typeof Status>)
    .filter(key => !isNaN(Number(Status[key])));

  @ViewChildren('progress') progress: QueryList<ElementRef> = new QueryList

  constructor(
    private authService: AuthService,
    private courseService: CourseService,
    private moduleService: ModuleService,
    private personService: PersonsService,
    private personCourseService: PersonCourseService,
    private userService: UserService,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit() {
    this.getModuleData();
    this.showEducationBossesDrop();
  }

  ngAfterViewInit(): void {
    this.progress.changes.subscribe(elm => {
      this.progressBar()
    })
  }  

  getModuleData() {
    this.moduleService.getModules().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.modules = res;
      console.log(this.modules);
    })
  }

  getCourseTableData(moduleId: number) {
    this.courseService.getCoursesByModuleId(moduleId).pipe(pipe(takeUntil(this.unsubscribe$))).subscribe(res => {
      this.courses = res;

      this.showedCourseList = this.courses
      this.getModuleData()
      this.courses.sort((a, b) => {
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      });
      this.sortCourseList();
    })
  }

  toggleTable(item: any) {    
    if ('moduleId' in item) {
      if (this.activeCourseList === item.moduleId) {
        this.activeCourseList = null;
        this.courseSelected = false;
        this.selectedCourseId = 0;
      }
      else {
        this.activeCourseList = item.moduleId;
        this.getCourseTableData(item.moduleId);
      }
    }
    else if ('userId' in item) {
      if (this.activeLeaderList === item.userId) {
        this.activeLeaderList = null
      }
      else {
        this.activeLeaderList = item.userId
        this.personService.getPersonsByDepartmentAndLocation(item.departmentId, item.locationId).pipe(pipe(takeUntil(this.unsubscribe$))).subscribe(res => {
          this.leaderPersons = res;
          console.log(res);
          
        })
      }
    }
  }

  getEducationLeaders() {
    if (this.role == "Uddannelsesleder") {
      this.userService.getUsersById(this.authService.getUserId()).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
        this.educationLeaders = [];
        this.educationLeaders.push(res)
        this.showedLeaderList = this.educationLeaders;
      })
    }
    else if (this.role == 'Uddannelseschef') {
      this.userService.getUsersByEducationBossId(this.authService.getUserId()).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
        this.educationLeaders = res;
        this.showedLeaderList = this.educationLeaders;
      })
    }
    else {
      this.userService.getUsersByUserRole(2).subscribe(res => {
        this.educationLeaders = res;
        this.showedLeaderList = this.educationLeaders;
      })
    }
  }

  getEducationBosses() {
    this.userService.getUsersByUserRole(2).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.educationBosses = res;
    })
  }

  showEducationBossesDrop() {
    this.role = this.authService.getUserRole();    
    if (this.role == 'Uddannelseschef' || this.role == 'Uddannelsesleder') {
      this.showEducationBossesDropdown = false;
    }
    else {
      this.showEducationBossesDropdown = true;
      this.getEducationBosses();
    }
  }

  toggleView(checked: boolean) {
    this.leaderView = checked;
    if (this.leaderView == true) {
      this.getEducationLeaders();
    }
  }

  setSelectedCourseId(courseId: number) {
    this.personService.getPersonByCourseId(courseId).subscribe(res => {
      this.persons = res;
      if (this.selectedCourseId == courseId) {
        this.courseSelected = false;
        this.selectedCourseId = 0;
      }
      else {
        this.courseSelected = true;
        this.selectedCourseId = courseId;
      }
    })
  }

  setSelectedPersonId(personId: number) {
    this.personCourseService.getPersonCoursesByPerson(personId).subscribe(res => {
      this.personsCoureses = res;
      if (this.selectedPersonId == personId) {
        this.personSelected = false;
        this.selectedPersonId = 0;
      }
      else {
        this.personSelected = true;
        this.selectedPersonId = personId;
      }
    })
  }

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      return;
    }

    this.showedCourseList = this.showedCourseList.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'Name':
          return this.compare(a.module.name.toLocaleLowerCase(), b.module.name.toLocaleLowerCase()) * (sort.direction == 'asc' ? 1 : -1);
        case 'StartDate':
          let test = this.compare(a.startDate, b.startDate) * (sort.direction == 'asc' ? 1 : -1);
          return test
        case 'EndDate':
          return this.compare(a.endDate, b.endDate) * (sort.direction == 'asc' ? 1 : -1);
        default:
          return 0;
      }
    });
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

  onEducationBossQueryInput(event: MatSelectChange) {
    const selectedValue = event.value;
    console.log(selectedValue);
    console.log(selectedValue == this.any);

    if (selectedValue == this.any) {
      console.log(this.educationLeaders);
      this.showedLeaderList = this.educationLeaders;
    }
    else {
      this.showedLeaderList = this.educationLeaders.filter(boss => boss.educationBossId == selectedValue);
    }
  }

  onTypeQueryInput(event: MatSelectChange) {
    const selectedValues = event.value;

    if (selectedValues.includes('Alle') && selectedValues.length > 1) {
      if (this.anyType) {
        this.selectedTypes = selectedValues.filter((value: any) => value !== 'Alle');
        this.anyType = false;
      }
      else if (!this.anyType) {
        this.selectedTypes = selectedValues.filter((value: any) => value == 'Alle');
        this.anyType = true;
      }
    }
    else {
      this.selectedTypes = selectedValues;
    }

    this.sortCourseList();
  }

  sortCourseList() {
    if (this.selectedTypes.includes(this.any)) {
      this.showedCourseList = this.courses;
    }
    else {
      this.showedCourseList = this.courses.filter(course =>
        this.selectedTypes.includes(CourseType[course.courseType as unknown as keyof typeof CourseType])
      );
    }
  }

  isCourseListActive(moduleId: number) {
    return this.activeCourseList === moduleId;
  }

  isLeaderListActive(moduleId: number) {
    return this.activeLeaderList === moduleId;
  }

  progressBar(): void {
    this.persons.forEach(person => {
      let objec = this.progress.find(x => x.nativeElement.id == person.personId);
      let howManyDaysInTotal = (new Date(person!.endDate).getTime() / 1000 - new Date(person!.hiringDate).getTime() / 1000) / 86400
      let howManyDaysSinceStart = (new Date().getTime() / 1000 - new Date(person!.hiringDate).getTime() / 1000) / 86400
      let inProcent = 0

      if (howManyDaysSinceStart < 0) {
        howManyDaysSinceStart = 0
      }

      if (new Date().getTime() / 1000 < new Date(person!.endDate).getTime() / 1000) {
        inProcent = (howManyDaysSinceStart / howManyDaysInTotal) * 100
      }
      else {
        inProcent = 100
      }

      if (objec === undefined) {
        return
      }

      objec!.nativeElement.style.width = inProcent + "%"
      if (inProcent < 75) {
        objec!.nativeElement.style.backgroundColor = "rgba(0, 128, 0, 0.30)"
      }
      if (inProcent > 75 && inProcent < 90) {
        objec!.nativeElement.style.backgroundColor = "rgba(255, 255, 0, 0.30)"
      }
      if (inProcent > 90) {
        objec!.nativeElement.style.backgroundColor = "rgba(255, 0, 0, 0.30)"
      }
    });
  }

  openAddCourseToModulePopup() {
    this.dialog.open(AddPersonCourseComponent, {
      data: {
        Module: this.modules.find(x => x.moduleId == this.selectedModuleId),
        currentCourses: this.courses,
        inactiveModules: []
      },
      disableClose: false,
      height: '40%',
      width: '30%'
    });
  }

  openAddPersonToCoursePopup() {
    this.dialog.open(AddPersonToCourseComponent, {
      data: {
        course: this.courses.find(x => x.courseId == this.selectedCourseId),
        persons: this.persons,
        inactiveModules: []
      },
      disableClose: false,
      height: '33%',
      width: '30%'
    });
  }

  openAddPersonCoursePopup() {
    this.dialog.open(AddPersonCourseComponent, {
      data: {
        person: this.leaderPersons.find(x => x.personId == this.selectedPersonId),
        currentCourses: this.courses,
        inactiveModules: []
      },
      disableClose: false,
      height: '40%',
      width: '30%'
    });
  }
}
