import { Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { takeUntil } from 'rxjs';
import { Course } from 'src/app/Models/Course';
import { CourseType } from 'src/app/Models/CourseType';
import { Module } from 'src/app/Models/Module';
import { CourseService } from 'src/app/Services/course.service';
import { ModuleService } from 'src/app/Services/module.service';
import { Unsub } from 'src/app/classes/unsub';

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.css']
})
export class ModuleComponent extends Unsub {
  sortList: string[] = ["Modul Navn", "Type", "Start dato", "Slut dato"];
  module: Module = new Module;
  courses: Course[] = [];
  showedList: Course[] = [];
  modules: Module[] = [];
  alle: string = "";
  searchName: string = "";
  pickedModule: string = "";
  searchModule: any = "";  
  searchType: any = 0;

  courseType: string[] = (Object.values(CourseType) as Array<keyof typeof CourseType>)
    .filter(key => !isNaN(Number(CourseType[key])));

  constructor(private courseService: CourseService, private moduleService: ModuleService) {
    super();
  }

  ngOnInit() {
    this.getTableData();
  }

  // Fetches the list of all courses
getCourses() {
  this.courseService.getAllCourses().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
    this.showedList = res;
  });
}

// Fetches the module data
getModuleData() {
  this.moduleService.getModules().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
    this.modules = res;
  })
}

// Fetches and processes course data for display
getTableData() {
  this.courseService.getAllCourses().subscribe(res => {
    this.courses = res
    console.log(this.courses);

    // Iterate through courses to assign completed modules (commented out for now)
    this.courses.forEach(element => {
      // element.completedModules = this.modulesCompletedMethod(element)
    });

    this.showedList = this.courses
    this.getModuleData()
    
    // Sorts courses by start date
    this.courses.sort((a, b) => {
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });
    this.showedList = this.courses
  })
}

// Filters the courses based on module name input
onModuleQueryInput(event: any) {
  let courseList: Course[] = []
  // Returns all courses if the search is empty
  if (event.value.toLocaleLowerCase() === "" && this.searchName.toLocaleLowerCase() == "") {
    this.showedList = this.courses
    this.searchModule = event.value;
    return
  }

  // Filters courses based on the module name
  this.courses.forEach(element => {
    if (element.module?.name.toLocaleLowerCase().includes(event.value.toLocaleLowerCase())) {
      courseList.push(element);
    }
  })
  this.showedList = courseList
  this.searchModule = event.value;
}

// Filters the courses based on the course type input
onTypeQueryInput(event: any) {
  let courseList: Course[] = []
  // Returns all courses if the search is empty
  if (event.value.toLocaleLowerCase() === "" && this.searchName.toLocaleLowerCase() == "") {
    this.showedList = this.courses
    this.searchModule = event.value;
    return
  }

  // Selects the course type
  const selectedType: CourseType = CourseType[event.value as keyof typeof CourseType];

  // Filters courses based on course type
  this.courses.forEach(element => {
    if (element.courseType === selectedType) {
      courseList.push(element);
    }
  })
  this.showedList = courseList
  this.searchType = event.value;
}

// Sorts the displayed courses based on active sorting criteria
sortData(sort: Sort) {
  if (!sort.active || sort.direction === '') {
    return;
  }

  this.showedList = this.showedList.sort((a, b) => {
    const isAsc = sort.direction === 'asc';
    switch (sort.active) {
      case 'Name':
        return this.compare(a.module.name.toLocaleLowerCase(), b.module.name.toLocaleLowerCase()) * (sort.direction == 'asc' ? 1 : -1);
      case 'Type':
        return this.compareCourseType(a.courseType, b.courseType) * (sort.direction == 'asc' ? 1 : -1);
      case 'StartDate':
        return this.compare(a.startDate, b.startDate) * (sort.direction == 'asc' ? 1 : -1);
      case 'EndDate':
        return this.compare(a.endDate, b.endDate) * (sort.direction == 'asc' ? 1 : -1);
      default:
        return 0;
    }
  });
}

// Compares the course type based on a predefined order
compareCourseType(a: CourseType, b: CourseType): number {
  const order: CourseType[] = [CourseType.Heltid, CourseType.Flex, CourseType.Deltid];
  return order[a] - order[b];
}

// Generic comparison function for sorting
compare(itemA: any, itemB: any): number {
  let retVal: number = 0;
  if (itemA && itemB) {
    if (itemA > itemB) retVal = 1;
    else if (itemA < itemB) retVal = -1;
  } else if (itemA) retVal = 1;
  else if (itemB) retVal = -1;
  return retVal;
}


}
