import { Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { takeUntil } from 'rxjs';
import { Course } from 'src/app/Models/Course';
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
  module: Module = new Module;
  courses: Course[] = [];
  modules: Module[] = [];

  constructor(private courseService: CourseService, private moduleService: ModuleService)
  {
    super();
  }

  ngOnInit() {
    this.getModules();
  }

  getCourses() {
    this.courseService.getAllCourses().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.courses = res;
    });
  }

  getModules() {
    this.moduleService.getModules().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.modules = res;
    });
  }

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      return;
    }

    this.courses = this.courses.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'Name':
          return this.compare(a.module.name.toLocaleLowerCase(), b.module.name.toLocaleLowerCase()) * (sort.direction == 'asc' ? 1 : -1);
        case 'Initials':
          return this.compare(a.courseType, b.courseType) * (sort.direction == 'asc' ? 1 : -1);
        case 'HiredDepartment':
          return this.compare(a.startDate, b.startDate) * (sort.direction == 'asc' ? 1 : -1);
        case 'HiredEndDate':
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

}
