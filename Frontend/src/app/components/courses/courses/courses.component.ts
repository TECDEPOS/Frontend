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
import { ModuleWithCourseViewModel } from 'src/app/Models/ViewModels/ModuleWithCourseViewModel';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent extends Unsub {
  any: any = 'Alle';
  anyEducationBoss: boolean = true;
  anyBoss: boolean = true;
  anyType: boolean = true;
  courseSelected: boolean = false;
  personSelected: boolean = false;
  showEducationBossesDropdown: boolean = false;
  leaderView: boolean = false;
  activeCourseList: number[] = [];
  activeLeaderList: number[] = [];
  selectedModuleIds: number[] = [];
  selectedCourseIds: number[] = [];
  selectedModuleId: number | null = 0;
  selectedCourseId: number | null = 0;
  selectedLeaderId: number | null = 0;
  selectedEducatorId: number | null = 0;
  role: string = '';
  selectedEducationBosses: any[] = [this.any];
  selectedEducationLeaders: any[] = [this.any];
  selectedBossesIds: any[] = [this.any];
  selectedStatus: Status[] = [this.any];
  selectedTypes: CourseType[] = [this.any];
  module: Module = new Module;
  courses: Course[] = [];
  showedCourseList: Course[] = [];
  modules: ModuleWithCourseViewModel[] = [];
  leaderPersons: Person[] = [];
  persons: PersonCourse[] = [];
  personsCoureses: PersonCourse[] = [];
  showedTeacherCourseList: PersonCourse[] = [];
  showedPersonCourses: PersonCourse[] = [];
  educationBosses: BossViewModel[] = [];
  educationLeaders: LeaderViewModel[] = [];
  showedLeaderList: LeaderViewModel[] = [];

  courseType: string[] = (Object.values(CourseType) as Array<keyof typeof CourseType>)
    .filter(key => !isNaN(Number(CourseType[key])));

  courseStatus: string[] = (Object.values(Status) as Array<keyof typeof Status>)
    .filter(key => !isNaN(Number(Status[key])));

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
    this.exportToExcelComponent.exportModulesToExcel(this.modules);
  }

  exportModulesToExcelTypes() {
    let newModules: ModuleWithCourseViewModel[] = [];
    if (this.selectedTypes.includes(this.any)) {
      newModules = JSON.parse(JSON.stringify(this.modules));
    }
    else {
      newModules = JSON.parse(JSON.stringify(this.modules.filter(m => this.selectedModuleIds.some(id => id == m.moduleId))));
    }

    newModules.forEach(module => {
      module.courses = module.courses.filter(course =>
        this.selectedTypes.includes(CourseType[course.courseType as unknown as keyof typeof CourseType])
      );
    });

    this.exportToExcelComponent.exportModulesToExcel(newModules);
  }

  exportCoursesToExcel() {    
    this.exportToExcelComponent.exportCoursesToExcel(this.courses.filter(c => this.selectedCourseIds.some(id => id == c.courseId)));
  }

  exportBossesToExcel() {
    if (this.selectedBossesIds.includes('Alle')) {
      var bosses: BossViewModel[] = this.exportToExcelComponent.bossViewModelConverter(
        this.educationBosses,
        this.educationLeaders
      )
    }
    else {
      var bosses: BossViewModel[] = this.exportToExcelComponent.bossViewModelConverter(
        this.educationBosses.filter(boss =>
          this.selectedBossesIds.some(selectedBossId =>
            selectedBossId == boss.userId
          )),
        this.educationLeaders
      )
    }

    this.exportToExcelComponent.exportBossesToExcel(bosses);
  }

  ngAfterViewInit(): void {
    this.progress.changes.subscribe(elm => {
      this.progressBar()
    })
  }

  getModuleData() {
    this.moduleService.getModulesWithCourse().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.modules = res;
    })
  }

  getCourseTableData(moduleId: number) {
    this.courses = this.modules.find(m => m.moduleId == moduleId)!.courses
    this.courses.sort((a, b) => {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });
  }

  toggleTable(item: any) {
    if ('moduleId' in item) {
      if (this.activeCourseList[0] === item.moduleId) {
        this.selectedModuleId = null;
        this.courseSelected = false;
        this.activeCourseList = this.activeCourseList.filter(course => course !== item.moduleId)
      }
      else {
        this.selectedModuleId = item.moduleId;
        this.activeCourseList = this.activeCourseList.filter(course => course !== item.moduleId)
        this.activeCourseList.unshift(item.moduleId)

        this.getCourseTableData(item.moduleId);
      }
      this.sortCourseList()
    }
    else if ('userId' in item) {
      console.log(item);
      if (this.selectedLeaderId === item.userId) {
        this.selectedLeaderId = null
        this.activeLeaderList = this.activeLeaderList.filter(leader => leader !== item.userId)
      }
      else {
        this.selectedLeaderId = item.userId

        const i = this.showedLeaderList.findIndex(x => x.userId == item.userId);

        this.leaderPersons = this.showedLeaderList[i].educators;
        this.activeLeaderList.unshift(item.userId)
      }
    }
  }

  getEducationLeaders() {
    this.userService.getEducationLeadersExcel().subscribe(res => {
      this.educationLeaders = res;
      this.showedLeaderList = this.educationLeaders;
      console.log(res);

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
      this.selectedCourseIds = this.selectedCourseIds.filter(id => id != courseId)
    }
    else {
      this.courseSelected = true;
      this.selectedCourseId = courseId;
      this.selectedCourseIds = this.selectedCourseIds.filter(id => id != courseId)
      this.selectedCourseIds.push(courseId)
      this.persons = this.modules.find(m => m.moduleId == this.selectedModuleId)!.courses.find(c => c.courseId == courseId)!.personCourses;
      this.showedPersonCourses = this.persons;
    }
  }

  setSelectedPersonId(personId: number) {
    if (this.selectedEducatorId == personId) {
      this.personSelected = false;
      this.selectedEducatorId = 0;
      this.personsCoureses = [];
    }
    else {
      this.personSelected = true;
      this.selectedEducatorId = personId;
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
            return this.compare(a.person?.name.toLocaleLowerCase(), b.person?.name.toLocaleLowerCase()) * (sort.direction == 'asc' ? 1 : -1);
          case 'moduleTeacherInitials':
            return this.compare(a.person?.initials.toLocaleLowerCase(), b.person?.initials.toLocaleLowerCase()) * (sort.direction == 'asc' ? 1 : -1);
          case 'moduleTeacherAfdeling':
            return this.compare(a.person?.department!.name.toLocaleLowerCase(), b.person?.department!.name.toLocaleLowerCase()) * (sort.direction == 'asc' ? 1 : -1);
          case 'moduleTeacherLocation':
            return this.compare(a.person?.location!.name.toLocaleLowerCase(), b.person?.location!.name.toLocaleLowerCase()) * (sort.direction == 'asc' ? 1 : -1);
          case 'moduleTeacherEndDate':
            return this.compare(a.person?.endDate, b.person?.endDate) * (sort.direction == 'asc' ? 1 : -1);
          case 'moduleCourseStatus':
            return this.compare(a.status, b.status) * (sort.direction == 'asc' ? 1 : -1);
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
    const selectedValues = event.value;

    if (selectedValues.includes('Alle') && selectedValues.length > 1) {
      if (this.anyBoss) {
        this.selectedBossesIds = selectedValues.filter((value: any) => value !== 'Alle');
        this.anyBoss = false;
      }
      else if (!this.anyBoss) {
        this.selectedBossesIds = selectedValues.filter((value: any) => value == 'Alle');
        this.anyBoss = true;
      }
    }
    else {
      this.selectedBossesIds = selectedValues;
    }
    console.log(this.selectedBossesIds);

    this.sortLeaderList();
  }

  sortLeaderList() {
    if (this.selectedBossesIds.includes(this.any)) {
      // If 'Alle' is included, show all education leaders
      this.showedLeaderList = this.educationLeaders;
    } else {
      // Filter educationLeaders based on selectedBossesIds
      this.showedLeaderList = this.educationLeaders.filter(leader =>
        // Check if any of the selectedBossesIds match the educationBossId of the leader
        this.selectedBossesIds.some(selectedBossId =>
          selectedBossId == leader.educationBossId
        )
      );
    }
  }

  onStatusQueryInput(event: MatSelectChange) {
    const selectedValues = event.value;

    if (selectedValues.includes('Alle') && selectedValues.length > 1) {
      if (this.anyType) {
        this.selectedStatus = selectedValues.filter((value: any) => value !== 'Alle');
        this.anyType = false;
      }
      else if (!this.anyType) {
        this.selectedStatus = selectedValues.filter((value: any) => value == 'Alle');
        this.anyType = true;
      }
    }
    else {
      this.selectedStatus = selectedValues;
    }

    this.sortEducatorList();
  }

  sortEducatorList() {
    if (this.selectedStatus.includes(this.any)) {
      this.showedPersonCourses = this.persons;
    }
    else {
      this.showedPersonCourses = this.persons.filter(personCourse =>
        this.selectedStatus.includes(Status[personCourse.status as unknown as keyof typeof Status])
      );
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
      // For the CourseList in the view from EducationalBosses
      this.showedTeacherCourseList = this.personsCoureses.filter(personCourse =>
        this.selectedTypes.some(selectedType =>
          personCourse.course!.courseType === CourseType[selectedType as unknown as keyof typeof CourseType]
        )
      );
    }
  }

  isCourseListActive(moduleId: number) {
    return this.selectedModuleId === moduleId;
  }

  isLeaderListActive(moduleId: number) {
    return this.selectedLeaderId === moduleId;
  }

  progressBar(): void {
    this.persons.forEach(person => {
      let objec = this.progress.find(x => x.nativeElement.id == person.personId);
      let howManyDaysInTotal = (new Date(person!.person!.endDate).getTime() / 1000 - new Date(person!.person!.hiringDate).getTime() / 1000) / 86400
      let howManyDaysSinceStart = (new Date().getTime() / 1000 - new Date(person!.person!.hiringDate).getTime() / 1000) / 86400
      let inProcent = 0

      if (howManyDaysSinceStart < 0) {
        howManyDaysSinceStart = 0
      }

      if (new Date().getTime() / 1000 < new Date(person!.person!.endDate).getTime() / 1000) {
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
        module: this.modules.find(x => x.moduleId == this.selectedCourseId),
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
        person: this.leaderPersons.find(x => x.personId == this.selectedEducatorId),
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
        return this.compare(a.person!.name.toLocaleLowerCase(), b.person!.name.toLocaleLowerCase()) * ('asc' ? 1 : -1);
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
