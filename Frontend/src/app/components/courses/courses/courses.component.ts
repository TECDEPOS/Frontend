import { Component } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Sort } from '@angular/material/sort';
import { takeUntil } from 'rxjs';
import { Course } from 'src/app/Models/Course';
import { CourseType } from 'src/app/Models/CourseType';
import { Module } from 'src/app/Models/Module';
import { Person } from 'src/app/Models/Person';
import { CourseService } from 'src/app/Services/course.service';
import { ModuleService } from 'src/app/Services/module.service';
import { Unsub } from 'src/app/classes/unsub';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent extends Unsub {
  module: Module = new Module;
  courses: Course[] = [];
  showedList: Course[] = [];
  modules: Module[] = [];
  persons: Person[] = [];
  any: any = 'Alle';
  searchName: string = "";
  pickedModule: string = "";
  searchModule: any = "";
  searchType: any = 0;
  anyModule: boolean = true;
  anyType: boolean = true;
  activeList: string | null = null
  selectedModules: string[] = [this.any];
  selectedTypes: CourseType[] = [this.any];
  selectedCourseId: number = 0;

  courseType: string[] = (Object.values(CourseType) as Array<keyof typeof CourseType>)
    .filter(key => !isNaN(Number(CourseType[key])));

  constructor(private courseService: CourseService, private moduleService: ModuleService) {
    super();
  }

  ngOnInit() {
    this.getTableData();
  }

  getCourses() {
    this.courseService.getAllCourses().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.showedList = res;
      console.log(res);
      
    });
  }

  getModuleData() {
    this.moduleService.getModules().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.modules = res;
    })
  }

  getTableData() {
    this.courseService.getAllCourses().subscribe(res => {
      this.courses = res
      console.log(this.courses);

      this.courses.forEach(element => {
        //element.completedModules = this.modulesCompletedMethod(element)
      });

      this.showedList = this.courses
      this.getModuleData()
      this.courses.sort((a, b) => {
        // Convert dates to Date objects and compare them
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      });
      this.showedList = this.courses
    })
  }

  public setSelectedCoureseId(courseId: number) {
    this.selectedCourseId = courseId;
  }

  public toggleList(courseId: number): boolean {
    if (this.selectedCourseId == courseId) {
      return true;
    }
    else {
      return false;
    }
  }


  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      return;
    }

    this.showedList = this.showedList.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'Name':
          return this.compare(a.module.name.toLocaleLowerCase(), b.module.name.toLocaleLowerCase()) * (sort.direction == 'asc' ? 1 : -1);
        case 'StartDate':
          let test = this.compare(a.startDate, b.startDate) * (sort.direction == 'asc' ? 1 : -1);
          console.log("test!:" + test);
          return test
        case 'EndDate':
          return this.compare(a.endDate, b.endDate) * (sort.direction == 'asc' ? 1 : -1);
        default:
          return 0;
      }
    });
  }

  compareCourseType(a: CourseType, b: CourseType): number {
    const order: CourseType[] = [CourseType.Heltid, CourseType.Flex, CourseType.Deltid];

    return order[a] - order[b];
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

  test(event: any) {
    let courseList: Course[] = []
    //Returns all, even null
    if (event.value.toLocaleLowerCase() === "" && this.searchName.toLocaleLowerCase() == "") {
      this.showedList = this.courses
      this.searchModule = event.value;
      return
    }

    //Checks for what matches with the Module and name
    this.courses.forEach(element => {
      if (element.module?.name.toLocaleLowerCase().includes(event.value.toLocaleLowerCase())) {
        courseList.push(element);
      }
    })
    this.showedList = courseList
    this.searchModule = event.value;
  }

  onModuleQueryInput(event: MatSelectChange) {
    const selectedValues = event.value;
    console.log(selectedValues);

    if (selectedValues.includes('Alle') && selectedValues.length > 1) {
      console.log(this.anyModule);

      if (this.anyModule) {
        this.selectedModules = selectedValues.filter((value: any) => value !== 'Alle');
        this.anyModule = false;
      }
      else if (!this.anyModule) {
        this.selectedModules = selectedValues.filter((value: any) => value == 'Alle');
        this.anyModule = true;
      }
    }
    else {
      this.selectedModules = selectedValues;
    }

    this.sortList();
  }

  onTypeQueryInput(event: MatSelectChange) {
    const selectedValues = event.value;

    if (selectedValues.includes('Alle') && selectedValues.length > 1) {
      console.log(this.anyModule);

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

    this.sortList();
  }

  sortList() {
    if (this.selectedModules.includes(this.any) && this.selectedTypes.includes(this.any)) {
      this.showedList = this.courses;
    }
    else if (!this.selectedModules.includes(this.any) && this.selectedTypes.includes(this.any)) {
      this.showedList = this.courses.filter(course => this.selectedModules.includes(course.module.name));
    }
    else if (this.selectedModules.includes(this.any) && !this.selectedTypes.includes(this.any)) {
      this.showedList = this.courses.filter(course =>
        this.selectedTypes.includes(CourseType[course.courseType as unknown as keyof typeof CourseType])
      );
    }
    else {
      this.showedList = this.courses.filter(course =>
        this.selectedModules.includes(course.module.name) &&
        this.selectedTypes.includes(CourseType[course.courseType as unknown as keyof typeof CourseType])
      );
    }
  }
}
