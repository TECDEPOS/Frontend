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
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent extends Unsub{
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
    activeList: string | null = null
  
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
  
    onModuleQueryInput(event: any) {
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
  
    onTypeQueryInput(event: any) {
      let courseList: Course[] = []
      //Returns all, even null
      if (event.value.toLocaleLowerCase() === "" && this.searchName.toLocaleLowerCase() == "") {
        this.showedList = this.courses
        this.searchModule = event.value;
        return
      }
  
      const selectedType: CourseType = CourseType[event.value as keyof typeof CourseType];
  
      //Checks for what matches with the Module and name
      this.courses.forEach(element => {
        console.log(element.courseType);
        console.log(event.value);
        
        
        if (element.courseType === selectedType) {
          courseList.push(element);
        }
      })
      this.showedList = courseList
      this.searchType = event.value;
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
          case 'Type':
            return this.compareCourseType(a.courseType, b.courseType) * (sort.direction == 'asc' ? 1 : -1);
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

    // Sorting part
    toggleList(listName: string) {
      // if (this.activeList === listName) {
      //   this.activeList = null
      // }
      // else {
      //   this.activeList = listName
      //   if (this.activeList == 'bookList') {
      //     this.getBooks();
      //   }
      //   else if (this.activeList == 'departmentList') {
      //     this.getDepartments();
      //   }
      //   else if (this.activeList == 'fileTagList') {
      //     this.getFileTags();
      //   }
      //   else if (this.activeList == 'locationList') {
      //     this.getLocations();
      //   }
      //   else if (this.activeList == 'moduleList') {
      //     this.getModules();
      //   }
      //   else if (this.activeList == 'courseList') {
      //     this.getCourses();
      //   }
      //   else if (this.activeList == 'personList') {
      //     this.getPersons();
      //   }
      //   else if (this.activeList == 'userList') {
      //     this.getUsers();
      //   }
      // }
    }
  
    isListActive(formName: string) {
      return this.activeList === formName;
    }
  }
  