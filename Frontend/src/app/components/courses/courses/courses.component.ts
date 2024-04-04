import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
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
import { AddCourseToModuleComponent } from '../../pop-ups/add-course-to-module/add-course-to-module.component';
import { ExportToExcelComponent } from '../../excel/export-to-excel/export-to-excel.component';
import { BossViewModel, LeaderViewModel } from 'src/app/Models/ViewModels/BossViewModel';

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
  showedTeacherCourseList: PersonCourse[] = [];
  educationBosses: BossViewModel[] = [];
  educationLeaders: LeaderViewModel[] = [];
  showedLeaderList: LeaderViewModel[] = [];


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
    private dialog: MatDialog,
    private exportToExcelComponent: ExportToExcelComponent
  ) {
    super();
  }

  ngOnInit() {
    this.getModuleData();
    this.showEducationBossesDrop();
  }

  exportModulesToExcel() {

    // this.exportToExcelComponent.exportModulesToExcel(this.modules);
  }

  ngAfterViewInit(): void {
    this.progress.changes.subscribe(elm => {
      this.progressBar()
    })
  }

  getModuleData() {
    this.moduleService.getModules().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.modules = res;

      this.exportModulesToExcel();
    })
  }

  getCourseTableData(moduleId: number) {
    this.courseService.getCoursesByModuleId(moduleId).pipe(pipe(takeUntil(this.unsubscribe$))).subscribe(res => {
      this.courses = res;

      this.showedCourseList = this.courses
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
      console.log(item);
      if (this.activeLeaderList === item.userId) {
        this.activeLeaderList = null
      }
      else {
        this.activeLeaderList = item.userId
        const i = this.showedLeaderList.findIndex(x => x.userId == item.userId);
        console.log(i);
          this.leaderPersons = this.showedLeaderList[i].educators;
      }
    }
  }

  getEducationLeaders() {
    this.userService.getEducationLeadersExcel().subscribe(res => {
      this.educationLeaders = res;
      this.showedLeaderList = this.educationLeaders;
    })
  }

  getEducationBosses() {
    this.userService.getEducationBossesExcel().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.educationBosses = res;
      console.log(res);

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
    if (this.selectedCourseId == courseId) {
      this.persons = [];
      this.courseSelected = false;
      this.selectedCourseId = 0;
    }
    else {
      this.courseSelected = true;
      this.selectedCourseId = courseId;
      this.personService.getPersonByCourseId(courseId).subscribe(res => {
        res.forEach(person => {
          person.personCourses.forEach(personCourse => {
            if (personCourse.courseId != courseId) {
              person.personCourses.splice(person.personCourses.findIndex(x => x.courseId == courseId), 1)
            }
          });
        });
        this.persons = res;
      })
    }
  }

  setSelectedPersonId(personId: number) {
    if (this.selectedPersonId == personId) {
      this.personSelected = false;
      this.selectedPersonId = 0;
      this.personsCoureses = [];
    }
    else {
      this.personSelected = true;
      this.selectedPersonId = personId;
      this.personCourseService.getPersonCoursesByPerson(personId).subscribe(res => {
        this.personsCoureses = res;

        this.sortCourseList();
      })
    }

  }

  sortData(sort: Sort, type: string) {
    if (!sort.active || sort.direction === '') {
      return;
    }
    console.log(type);
    console.log(sort);


    if (type == 'mc') {
      this.showedCourseList = this.showedCourseList.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'moduleCourseType':
            return this.compare(a.courseType, b.courseType) * (sort.direction == 'asc' ? 1 : -1);
          case 'moduleCourseStartDate':
            return this.compare(a.startDate, b.startDate) * (sort.direction == 'asc' ? 1 : -1);
          case 'moduleCourseEndDate':
            return this.compare(a.endDate, b.endDate) * (sort.direction == 'asc' ? 1 : -1);
          default:
            return 0;
        }
      });
    }
    else if (type == 'mt') {
      this.persons = this.persons.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'moduleTeacherName':
            return this.compare(a.name.toLocaleLowerCase(), b.name.toLocaleLowerCase()) * (sort.direction == 'asc' ? 1 : -1);
          case 'moduleTeacherInitials':
            return this.compare(a.initials.toLocaleLowerCase(), b.initials.toLocaleLowerCase()) * (sort.direction == 'asc' ? 1 : -1);
          case 'moduleTeacherAfdeling':
            return this.compare(a.department!.name.toLocaleLowerCase(), b.department!.name.toLocaleLowerCase()) * (sort.direction == 'asc' ? 1 : -1);
          case 'moduleTeacherLocation':
            return this.compare(a.location!.name.toLocaleLowerCase(), b.location!.name.toLocaleLowerCase()) * (sort.direction == 'asc' ? 1 : -1);
          case 'moduleTeacherEndDate':
            return this.compare(a.endDate, b.endDate) * (sort.direction == 'asc' ? 1 : -1);
          case 'moduleCourseStatus':
            return this.compare(a.personCourses[0].status, b.personCourses[0].status) * (sort.direction == 'asc' ? 1 : -1);
          default:
            return 0;
        }
      });
    }
    else if (type == 'lt') {
      this.leaderPersons = this.leaderPersons.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'leaderTeacherName':
            return this.compare(a.name.toLocaleLowerCase(), b.name.toLocaleLowerCase()) * (sort.direction == 'asc' ? 1 : -1);
          case 'leaderTeacherInitials':
            return this.compare(a.initials.toLocaleLowerCase(), b.initials.toLocaleLowerCase()) * (sort.direction == 'asc' ? 1 : -1);
          case 'moduleTeacherAfdeling':
            return this.compare(a.department!.name.toLocaleLowerCase(), b.department!.name.toLocaleLowerCase()) * (sort.direction == 'asc' ? 1 : -1);
          case 'leaderTeacherLocation':
            return this.compare(a.location!.name.toLocaleLowerCase(), b.location!.name.toLocaleLowerCase()) * (sort.direction == 'asc' ? 1 : -1);
          case 'leaderTeacherEndDate':
            return this.compare(a.endDate, b.endDate) * (sort.direction == 'asc' ? 1 : -1);
          default:
            return 0;
        }
      });
    }
    else if (type == 'lc') {
      this.showedTeacherCourseList = this.showedTeacherCourseList.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'leaderCourseName':
            return this.compare(a.course!.module.name.toLocaleLowerCase(), b.course!.module.name.toLocaleLowerCase()) * (sort.direction == 'asc' ? 1 : -1);
          case 'leaderCourseType':
            return this.compare(a.course!.courseType, b.course!.courseType) * (sort.direction == 'asc' ? 1 : -1);
          case 'leaderCourseStartDate':
            return this.compare(a.course!.startDate, b.course!.startDate) * (sort.direction == 'asc' ? 1 : -1);
          case 'leaderCourseEndDate':
            return this.compare(a.course!.endDate, b.course!.endDate) * (sort.direction == 'asc' ? 1 : -1);
          case 'leaderCourseStatus':
            return this.compare(a.status, b.status) * (sort.direction == 'asc' ? 1 : -1);
          default:
            return 0;
        }
      });
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

  onEducationBossQueryInput(event: MatSelectChange) {
    const selectedValue = event.value;

    if (selectedValue == this.any) {
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
      this.showedTeacherCourseList = this.personsCoureses;
    }
    else {
      this.showedCourseList = this.courses.filter(course =>
        this.selectedTypes.includes(CourseType[course.courseType as unknown as keyof typeof CourseType])
      );
      this.showedTeacherCourseList = this.personsCoureses.filter(personCourse =>
        this.selectedTypes.some(selectedType =>
          personCourse.course!.courseType === CourseType[selectedType as unknown as keyof typeof CourseType]
        )
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
    this.dialog.open(AddCourseToModuleComponent, {
      data: {
        module: this.modules.find(x => x.moduleId == this.activeCourseList),
        currentCourses: this.courses
      },
      disableClose: false,
      height: '40%',
      width: '30%'
    }).afterClosed().subscribe(() => {
      this.organizedCourseList()
    });
  }

  openAddPersonToCoursePopup() {
    this.dialog.open(AddPersonToCourseComponent, {
      data: {
        course: this.courses.find(x => x.courseId == this.selectedCourseId),
        persons: this.persons
      },
      disableClose: false,
      height: '33%',
      width: '30%'
    }).afterClosed().subscribe(() => {
      this.organizedPersonTable()
    });
  }

  openAddPersonCoursePopup() {
    this.dialog.open(AddPersonCourseComponent, {
      data: {
        person: this.leaderPersons.find(x => x.personId == this.selectedPersonId),
        currentPersonCourses: this.personsCoureses,
        closeAfter: false,
      },
      disableClose: false,
      height: '45%',
      width: '30%'
    }).afterClosed().subscribe(() => {
      this.organizedPersonCourseTable()
    });
  }

  organizedCourseList() {
    if (this.courses.length !== 0) {
      this.courses = this.courses.sort((a, b) => {
        // Compare start dates
        const startDateComparison = this.compare(a.startDate, b.startDate) * ('asc' ? -1 : 1);

        // If start dates are equal, compare end dates
        if (startDateComparison === 0) {
          return this.compare(a.endDate, b.endDate);
        }

        // Otherwise, return the comparison result based on start dates
        return startDateComparison;
      });
    }
  }

  organizedPersonTable() {
    if (this.persons.length !== 0) {
      this.persons = this.persons.sort((a, b) => {
        return this.compare(a.name.toLocaleLowerCase(), b.name.toLocaleLowerCase()) * ('asc' ? 1 : -1);
      })
    }
  }

  organizedPersonCourseTable() {
    if (this.personsCoureses.length !== 0) {
      this.personsCoureses = this.personsCoureses.filter(x => x.status === 1)
        .concat(this.personsCoureses.filter(x => x.status === 0))
        .concat(this.personsCoureses.filter(x => x.status === 3))
        .concat(this.personsCoureses.filter(x => x.status === 2));
    }
  }
}
